import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// "YOUR_SUPABASE_URL", "YOUR_SUPABASE_API_KEY"
const supabase = createClient(
  process.env.SUPABASE_URL,
 process.env.SUPABASE_API_KEY
);

/*
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);


async function createCommand() {
const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
];
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_SERVER_ID
      ),
      {
        body: commands,
      }
    );

  } catch (err) {
    console.log(err);
  }
}

createCommand();


*/


client.once("ready", () => {
  console.log("Bot is ready!");
});

// YOUR_VOICE_CHANNEL_ID
const channelToTrack = process.env.VOICE_CHANNEL;

const userDurations = new Map();

client.on("voiceStateUpdate", (oldState, newState) => {
  const user = newState.member;

  if (user && newState.channelId === channelToTrack) {
    // User joined the specified voice channel
    const startTime = new Date();
    console.log(
      `${user.user.tag} joined ${newState.channel?.name}: ${startTime}`
    );
    // Record the start time
    userDurations.set(user.id, { startTime: new Date(),endTime:null, totalDuration: 0 });

    // You can save this information to Superbase or perform other actions
  }

  if (user && oldState.channelId === channelToTrack && !newState.channel) {
    // User left the specified voice channel
    const userUId = user.user.id
    const userTag = user.user.tag
    const userGlobalName = user.user.globalName
    const end = new Date()
    console.log(`${userGlobalName} left ${oldState.channel?.name}: ${end}`);

    const durationInfo = userDurations.get(user.id);

    if (durationInfo) {
      // Calculate the duration and update the total duration
      durationInfo.endTime =end
      durationInfo.totalDuration = Math.floor((durationInfo.endTime.getTime() - durationInfo.startTime.getTime())/1000);
      console.log(durationInfo)

saveDuration(
  userUId,
  userGlobalName,
  userTag,
  durationInfo.startTime,
  durationInfo.endTime,
  durationInfo.totalDuration
);

      // Remove the user from the tracking map
      userDurations.delete(user.id);

    // You can save this information to Superbase or perform other actions
  }
  }
})
async function saveDuration(dsUId, dsGlobalName, dsTag, start, end, duration) {
  // Save the duration to the Superbase database

  const { data, error, status } = await supabase
    .from("user")
    .insert({ dsUId, dsGlobalName, dsTag, start, end, duration })
    .select();

  if (error) {
    console.log(error);
  } else {
    console.log(data, status);
  }
}
client.login(
process.env.DISCORD_TOKEN
);

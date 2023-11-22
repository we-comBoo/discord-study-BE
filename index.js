
const { createClient } = require("@supabase/supabase-js");
const client = require("./client");
const dotenv =require("dotenv");
dotenv.config();


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


function startDuration(userId){

  // Record the start time
  userDurations.set(userId, {
    startTime: new Date(),
    endTime: null,
    totalDuration: 0,
  });
}

function endDuration(durationInfo) {
  durationInfo.endTime = new Date();
  durationInfo.totalDuration = Math.floor(
    (durationInfo.endTime.getTime() - durationInfo.startTime.getTime()) / 1000
  );
}

client.on("voiceStateUpdate", (oldState, newState) => {
  const user = newState.member;
  // console.log(user)

  if (user && newState.channelId === channelToTrack) {
      // 이벤트 발생이 최초로 입장한 유저의 경우
      if(userDurations.has(user.id)===false){
        // User joined the specified voice channel
        console.log(
          `${user.user.tag} joined ${newState.channel?.name}: ${new Date()}`
        );
        startDuration(user.id);
      }

  } else if (
    user &&
    oldState.channelId === channelToTrack &&
    newState.channel === null
  ) {
    // User left the specified voice channel



    const { id: userUId, tag: userTag, globalName: userGlobalName } = user.user;
        console.log(`${userGlobalName} left ${oldState.channel?.name}: ${new Date()}`);

    if (userDurations.has(userUId)) {
      const durationInfo = userDurations.get(userUId);
      endDuration(durationInfo);
      const { startTime, endTime, totalDuration } = durationInfo;
      saveDuration(
        userUId,
        userGlobalName,
        userTag,
        startTime,
        endTime,
       totalDuration
      );
      // Remove the user from the tracking map
      userDurations.delete(user.id);
    }
    



  }
});
async function saveDuration(dsUId, dsGlobalName, dsTag, start, end, duration) {
  // Save the duration to the Superbase database

  const { data, error, status } = await supabase
    .from("user")
    .insert({ dsUId, dsGlobalName, dsTag, start, end, duration });

  if (error) {
    console.log(error);
  } else {
    console.log(data, status);
  }
}
client.login(process.env.DISCORD_TOKEN);

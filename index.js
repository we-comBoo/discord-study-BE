const client = require("./client");
const supabase = require("./supabase");
const {
  startDuration,
  endDuration,
  userDurations,
  saveDuration,
} = require("./duration");
const dotenv =require("dotenv");
dotenv.config();





client.once("ready", () => {
  console.log("Bot is ready!");
});


// YOUR_VOICE_CHANNEL_ID
const channelToTrack = process.env.VOICE_CHANNEL;

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
      const userDurationInfo = userDurations.get(userUId);
      endDuration(userDurationInfo);
      const { startTime, endTime, totalDuration } = userDurationInfo;
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

client.login(process.env.DISCORD_TOKEN).catch(error=>{
  console.log(err);
  process.exit(1)
});

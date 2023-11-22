
const userDurations = new Map();

function startDuration(userId) {
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


async function saveDuration(dsUId, dsGlobalName, dsTag, start, end, duration) {
  // Save the duration to the Superbase database

  try {
    const { data, error, status } = await supabase
      .from("user")
      .insert({ dsUId, dsGlobalName, dsTag, start, end, duration });

    if (error) {
      console.log(error);
    } else {
      console.log(data, status);
    }
  } catch (err) {
    console.log(err);
  }
}


module.exports = {
  startDuration,
  endDuration,
  saveDuration,
  userDurations
}
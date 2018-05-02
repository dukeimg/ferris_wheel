const fps = 60;

const anim8 = ({startValue, endValue, duration, step}) => {
  let frame = 0;
  const targetFrame = duration / 1000 * fps;

  let interval = setInterval(function(){
    frame ++;
    let now = startValue + ((endValue - startValue) * frame) / targetFrame;
    step(now);
    if (frame === targetFrame) clearInterval(interval);
  }, duration / targetFrame);
};
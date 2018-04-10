const script = document.createElement('script');
script.type = 'text/javascript';
script.async = true;
script.src = 'https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js';
document.body.appendChild(script);

const wrapper = document.createElement('div');
wrapper.id = 'memerWrap';
const img = new Image();
img.width = 24;
img.src = "https://i.imgur.com/EeEsaJ3.png";

document.body.addEventListener('click', function(target) {
  if(target.target.id !== 'memesList' && target.target.parentNode.id !== 'memesList') {
    if (document.getElementById('memesList')) {
      document.body.removeChild(document.getElementById('memesList'));
      wrapper.style.filter = 'grayscale(100%)';
    }
  }
  if(target.target.parentNode.id !== 'imgWrap') {
    if (document.getElementById('imgWrap')) {
      document.body.removeChild(document.getElementById('imgWrap'));
    }
  }
});

wrapper.appendChild(img);
wrapper.style = "margin-right: 50px";

const wait = setTimeout(function() {
  clearTimeout(wait);
  const top = document.querySelector('svg[name=Mention]').parentNode;
  top.appendChild(wrapper);
},100);

history.pushState = function(args) {
  const wait = setTimeout(function() {
    clearTimeout(wait);
    const top = document.querySelector('svg[name=Mention]').parentNode;
    top.appendChild(wrapper);
  },100);
}

wrapper.style.filter = "grayscale(100%)";

const tools = document.getElementsByClassName('tooltips')[0];
const tip = document.createElement('div');
tip.setAttribute('class', 'tooltip tooltip-bottom tooltip-black');
tip.innerHTML = 'Memes';

wrapper.addEventListener('mouseover', function() {
  wrapper.style.filter = "grayscale(0%)";
  wrapper.style.cursor = "pointer";
  const loc = wrapper.getBoundingClientRect();
  tip.style = `left: ${loc.left - 21}px; top: 58px;`;
  tools.appendChild(tip);
});
wrapper.addEventListener('mouseout', function() {
  if(!document.getElementById('memesList')) {
    wrapper.style.filter = "grayscale(100%)";
  }
  tools.removeChild(tip);
});

const request = require('request');
wrapper.addEventListener('click', function() {
  if(!document.getElementsByTagName("textarea").length) return;
  if(document.getElementsByTagName("textarea")[0].getAttribute('class').startsWith('textAreaDisabled')) return;
  if(document.getElementById('memesList')) {
    document.body.removeChild(document.getElementById('memesList'));
    return;
  }

  request('https://api.imgflip.com/get_memes', function (err,a,b) {
    wrapper.style.filter = "grayscale(0%)";
    const res = JSON.parse(b);
    const memes = res.data.memes;
    const memesList = document.createElement('div');
    memesList.style = "position: absolute; z-index: 1000;display: flex; flex-flow: row wrap; overflow: scroll; margin-bottom: 3px; width: 218px;\
    height: 400px; align-items: center; justify-content: center; overflow-x: hidden; background: #353535; margin: auto; top: -102px; left: 72%; right: 0;\
    bottom: 0";

    const css = document.createElement('style');
    css.type = 'text/css';
    css.innerHTML = `
#memesList::-webkit-scrollbar {
  width: 12px;
}

#memesList::-webkit-scrollbar-track {
  background: #2f3136;
  background-clip: padding-box;
  border: 3px solid #36393e;
  border-radius: 10px;
}

#memesList::-webkit-scrollbar-thumb {
  background-color: #1e2124;
  background-clip: padding-box;
  border: 3px solid #1e2124;
  border-radius: 10px;
}
    `
    css.id = "memeList_style"
    document.body.appendChild(css);

    memesList.id = 'memesList';
    memes.map(function(ele) {
      const img = new Image();
      img.src = ele.url;
      img.id = ele.id;
      img.style.display = 'flex';
      img.height = 100;
      memesList.appendChild(img);
    });
    document.body.appendChild(memesList);

    memesList.addEventListener('click', function(click) {
      if (click.target.id !== 'memesList') {
        click.target.height = 300;
        const div = document.createElement('div');
        const topText = document.createElement('input');
        const botText = document.createElement('input');
        const submit = document.createElement('button');

        topText.setAttribute('type', 'text');
        botText.setAttribute('type', 'text');

        submit.id = 'memeSubmit';
        topText.id = 'topText';
        botText.id = 'bottomText';

        submit.innerHTML = "Finish";
        topText.setAttribute('placeholder', 'Top Text');
        botText.setAttribute('placeholder', 'Bottom Text');

        div.id = 'imgWrap';
        click.target.style = 'position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0;';

        document.body.appendChild(div);
        div.appendChild(click.target);

        const wait = setTimeout(function () {
          clearTimeout(wait);
          const loc = click.target.getBoundingClientRect();

          submit.style = 'position: absolute; margin: auto; left: 59.5%; z-index: 10000; top:' + (loc.bottom - 23) + 'px; height: 23px';
          topText.style = 'position: absolute; margin: auto; left: 43%; z-index: 10000; top:' + loc.top + 'px;';
          botText.style = 'position: absolute; margin: auto; left: 43%; z-index: 10000; top:' + (loc.bottom - 23) + 'px;';

          div.appendChild(submit);
          div.appendChild(topText);
          div.appendChild(botText);

          document.body.removeChild(memesList);
        },100);

        submit.addEventListener('click', function () {
          const channel = ReactUtilities.getOwnerInstance($("form")[0]).props.channel;
          const queueMsg = InternalUtilities.WebpackModules.findByUniqueProperties(["enqueue"]);
          if (!topText.value && !botText.value) return alert('Please input at leat one field!');

          request('https://api.imgflip.com/caption_image?template_id=' + click.target.id + '&username=mh5000&password=ThisIsForABot123&text0=' + topText.value + '&text1=' + botText.value, function (err,a,b) {
            const embed = {
              image: {
                  url: JSON.parse(b).data.url
              }
            }
            queueMsg.enqueue({
              type: "send",
              message: {
                channelId: channel.id,
                tts: false,
                embed
              }
            }, function (err) {
              if (!err.ok) return alert('An Error Occured!');
            });
            document.body.removeChild(div);
          });
        });
      }
    });
  });
});

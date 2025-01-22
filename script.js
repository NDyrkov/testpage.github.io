if (localStorage.firststart == null) {
  localStorage.firststart = Date.now();
}

const ua = new UAParser().getResult();

let screenOrientations = {
  "270": false,
  "0": false,
  "90": false
};

if (typeof screen.orientation !== "undefined") {
    screen.orientation.addEventListener('change', function (e) { 
      checkScreenOrientation(); 
    });
}

let topleft = false;
let topright = false;
let bottomleft = false;
let bottomright = false;

function checkScreenOrientation() {
  if (typeof screen.orientation !== "undefined") {
    screenOrientations[screen.orientation.angle] = true;
  }
}

const fullscreenStyle = "width: 100dvw; height: 100dvh; box-sizing: content-box; border-radius: 0;";
const dialogStyle = "top: 29px; max-height: calc(100dvh - 67px);";

window.testUnits = [
  {
    name: "cookie",
    text: "Поддержка cookie",
    status: false,
    func: function () {
      document.cookie = "testcookie";
      return (document.cookie.indexOf("testcookie") != -1);
    },
    style: dialogStyle,
    content: `<h2>Поддержка cookie</h2>WebView должен поддерживать cookie для правильной работы сайтов.<br>Работа cookie проверяется автоматически.`
  },
  {
    name: "session",
    text: "Сохранение сессий",
    status: false,
    func: function () {
      return !!window.sessionStorage;
    },
    style: dialogStyle,
    content: "<h2>Поддержка хранения сессий</h2>WebView должен поддерживать сохранение сессий пользователя.<br>Сохранение сессий проверяется автоматически."
  },
  {
    name: "useragent",
    text: "Useragent",
    status: false,
    func: function () {
      return (!!ua.browser.name && !!ua.os.name && !ua.browser.name.includes('WebView'));
    },
    style: dialogStyle,
    content: "<h2>Useragent</h2>Useragent не должен указывать на использование WebView.<br><br><span id='uaspan'></span>",
    script: function () {
      document.querySelector('#uaspan').innerText=navigator.userAgent;
    }
  },
  {
    name: "autoplayvideo",
    text: "Авто­воспроиз­ведение видео",
    status: false,
    func: function () {
      return document.querySelector("#video").played.length == 1;
    },
    style: dialogStyle,
    content: "<h2>Авто­воспроиз­ведение видео</h2>Видео ниже должно проигрываться автоматически при открытии страницы без раскрытия на весь экран.<br><br><video playsinline autoplay loop muted><source src='video.mp4' type='video/mp4'></video>"
  },
  {
    name: "params",
    text: "Передача параметров",
    status: false,
    func: function () {
      const url = new URL(window.location);
      return (url.searchParams.get("sub_id_1") == "testsub1" &&
              url.searchParams.get("sub_id_2") == "testsub2" &&
              url.searchParams.get("sub_id_3") == "testsub3" &&
              url.searchParams.get("sub_id_4") == "testsub4" &&
              /^\d+\-\d+$/.test(url.searchParams.get("sub_id_10")) &&
              url.searchParams.get("sub_id_11") == "Test Source" &&
              url.searchParams.get("extra_param_2") == "testextra2" &&
              url.searchParams.get("extra_param_3") == "testextra3" &&
              url.searchParams.get("extra_param_4") == "testextra4" &&
              url.searchParams.get("extra_param_5") == "testextra5" &&
              url.searchParams.get("extra_param_6") == "testextra6" &&   
              url.searchParams.get("extra_param_7").includes("campaign=testsub_testsub2_testsub_testsub_testsub_testsub_testsub_testsub1 #extra") && 
              url.searchParams.get("extra_param_7").includes("campaign_id=testsub4") &&
              url.searchParams.get("extra_param_7").includes("media_source=Test Source") &&
              url.searchParams.get("extra_param_8") == "testsub_testsub2_testsub_testsub_testsub_testsub_testsub_testsub1 #extra") || localStorage.getItem("params") == "true";
    },
    style: dialogStyle,
    content: "<h2>Передача параметров</h2>Приложение должно передавать на сайт ряд параметров, описанный в документации для разработки.<br><br><div id='paramspan' style='text-align:start;'></div>",
    script: function () {
      const url = new URL(window.location);
      for (let param of url.searchParams.entries()) { 
        document.querySelector('#paramspan').append(document.createTextNode(param.join(' = ')));
        document.querySelector('#paramspan').append(document.createElement('br'));
        document.querySelector('#paramspan').append(document.createElement('br'));
      } 
    }
  },
  {
    name: "push",
    text: "Полу­чение уведом­лений",
    status: false,
    func: function () {
      return (localStorage.pushurlpage == 'true' && document.querySelector("#pushicon").checked && document.querySelector("#pushimage").checked) || (localStorage.pushurlpage == 'true' && document.querySelector("#pushimage").checked && ua.os.name == 'iOS') || localStorage.getItem("push") == "true";
    },
    style: dialogStyle,
    content: "<h2>Полу­чение уведом­лений</h2>Приложение должно быть настроено на получение уведомлений по значению Appsflyer ID пользователя.<br><br><div id='beforepush'>Для проверки уведомлений необходимо скопировать ссылку ниже, перейти по ней в браузере и нажать на уведомление после его получения.<br><br><input id='pushlink' type='text' disabled><button id='pushlinkbutton'>Скопировать</button><div id='pushlinktooltip'></div></div><br><div id='afterpush' style='display:none;'><div id='pushiconblock'><input type='checkbox' id='pushicon' name='pushicon'><label for='pushicon'>Уведомление содержит кастомную иконку</label></div><br><div><input type='checkbox' id='pushimage' name='pushimage'><label for='pushimage'>Уведомление содержит изображение</label></div></div>",
    script: function () {
      const url = new URL(window.location);
      if (url.searchParams.has("sub_id_10")) {
        localStorage.afid = url.searchParams.get("sub_id_10");
      }
      if (localStorage.afid != null) {
        document.querySelector("#pushlink").value = `https://afsub.com/sendpush?af_id=${localStorage.afid}`;
      }
      document.querySelector("#pushlinkbutton").addEventListener("click", function () {
        document.querySelector("#pushlink").disabled = false;
        document.querySelector("#pushlink").select();
        document.execCommand("copy");
        document.querySelector("#pushlink").disabled = true;
        let x = document.createElement("div");
        x.setAttribute("style",`width:180px;color:#fff;text-align:center;font-size:16px;font-family:system-ui;position:absolute;z-index:999;left:calc(50% - 90px);bottom:30px;padding:8px;border-radius:16px;background:#333a;`);
        x.innerHTML = "Скопировано в буфер обмена!";
        document.querySelector("#pushlinktooltip").appendChild(x);
        setTimeout(function(){document.querySelector("#pushlinktooltip").removeChild(x)},2000);
      });
      if (localStorage.pushurlpage == 'true') {
        document.querySelector("#beforepush").style.filter = "opacity(0.3)";
        document.querySelector("#afterpush").style.display = "block";
        if (ua.os.name == 'iOS') {
          document.querySelector("#pushiconblock").style.display = "none";
        }
      }
    }
  },
  {
    name: "files",
    text: "Загрузка файлов",
    status: false,
    func: function () {
      return (document.querySelector("#fileinput").files.length > 0 && document.querySelector("#camerainput").files.length > 0) || localStorage.getItem("files") == "true";
    },
    style: dialogStyle,
    content: "<h2>Загрузка файлов</h2>Приложение должно поддерживать загрузку файлов на сайт без запроса разрешения на доступ к файловой системе.<div><br><label class='input' for='input'>Файлы</label><input class='input' type='file' name='input' id='fileinput'></div><br>Загрузка файлов через камеру не обязательна.<br>Допустима работа аналогичная обычной загрузке файлов.<br><br><div><label class='input' for='inputCamera'>Камера</label><input class='input' type='file' name='inputCamera' capture='camera' id='camerainput'></div>"
  },
  {
    name: "keyboard",
    text: "Пере­крытие контента клавиа­турой",
    status: false,
    func: function () {
      return document.querySelector("#bottominput").checked || localStorage.getItem("keyboard") == "true";
    },
    style: fullscreenStyle,
    content: "<div style='bottom: 30px; position: absolute; width: calc(100% - 2em);'><h2>Пере­крытие контента клавиа­турой</h2>Открытая клавиатура не должна перекрывать активное поле ввода.<br><br><div><input type='checkbox' id='bottominput' name='bottominput'><label for='bottominput'>Клавиатура не перекрывает поле ввода</label></div><br><button onclick='this.parentElement.parentElement.close()'>Закрыть диалог</button><br><br><input type='text'></div>"
  },
  {
    name: "homepage",
    text: "Запуск новой ссылки",
    status: false,
    func: function () {
      return localStorage.getItem("newpage") == "true";
    },
    style: dialogStyle,
    content: "<h2>Запуск новой ссылки</h2>Приложение должно запустить новую ссылку при втором запуске.<br><br>Перезапустите приложение для проверки этой функции."
  },
  {
    name: "splash",
    text: "Экран загрузки",
    status: false,
    func: function () {
      return document.querySelector("#splashscreencheck").checked || localStorage.getItem("splash") == "true";
    },
    style: dialogStyle,
    content: "<h2>Экран загрузки</h2>Экран загрузки приложения должен соответствовать дизайну приложения и иметь анимированную индикацию загрузки.<br><br><div><input type='checkbox' id='splashscreencheck' name='splashscreencheck'><label for='splashscreencheck'>Экран загрузки выглядит верно</label></div>"
  },
  {
    name: "webviewsize",
    text: "Размер вебвью",
    status: false,
    func: function () {
      return (document.querySelector("#webviewsizecheck").checked && document.querySelector("#safeareaoutcheck").checked && topleft && topright && bottomleft && bottomright) || localStorage.getItem("webviewsize") == "true";
    },
    style: fullscreenStyle,
    content: "<div style='bottom: 1em; position: absolute; width: calc(100% - 2em); overflow: auto; height: calc(100% - 2em);'><h2>Размер вебвью</h2>Вебвью должен отображаться в рамках Safe Area, зоны, где элементы интерфейса системы или вырезы в экране устройства не будут перекрывать контент. Все, что находится за пределами вебвью должно иметь черный фон.<br><br><image style='width: clamp(200px, 100%, 600px);' src='safearea.webp'><br><br>Проверьте границы вебвью, нажав на уголки.<br><br><div><input type='checkbox' id='webviewsizecheck' name='webviewsizecheck'><label for='webviewsizecheck'>Ничто не перекрывает контент в вебвью</label></div><br><div><input type='checkbox' id='safeareaoutcheck' name='safeareaoutcheck'><label for='safeareaoutcheck'>Фон приложения за пределами Safe Area выглядит верно</label></div><br><button onclick='this.parentElement.parentElement.close()'>Закрыть диалог</button></div><div class='corner top left'></div><div class='corner top right'></div><div class='corner bottom left'></div><div class='corner bottom right'></div>",
    script: function () {
      document.querySelector('.corner.top.left').onclick = function () {
        topleft = true; 
        this.style.background = `green`;
      }
      document.querySelector('.corner.top.right').onclick = function () {
        topright = true; 
        this.style.background = `green`;
      }
      document.querySelector('.corner.bottom.left').onclick = function () {
        bottomleft = true; 
        this.style.background = `green`;
      }
      document.querySelector('.corner.bottom.right').onclick = function () {
        bottomright = true; 
        this.style.background = `green`;
      }
    }
  }, 
  {
    name: "screenrotate",
    text: "Поворот экрана",
    status: false,
    func: function () {
      return (!Object.values(screenOrientations).includes(false) || localStorage.getItem("screenrotate") == "true");
    },
    style: dialogStyle,
    content: "<h2>Поворот экрана</h2>Приложение должно позволять пользователю повернуть контент вебвью в горизонтальный режим. Это может работать как в рамках встроенных настроек устройства, так и в виде автоматического поворота вне зависимости от настроек устройства пользователя.<br><br>Для проверки функции поверните контент вертикально и горизонтально в два положения."
  },
  {
    name: "backbutton",
    text: "Возврат на прошлую страницу",
    status: false,
    func: function () {
      return (localStorage.thirdPage == "true") || localStorage.getItem("backbutton") == "true";
    },
    style: dialogStyle,
    content: "<h2>Возврат на прошлую страницу</h2>Приложение должно поддерживать возврат на прошлую страницу стандартными методами системы, кнопками или жестами.<br><br>Перейдите по ссылке ниже на вторую, а затем на третью страницу и вернитесь на текущую страницу для проверки функции.<br><br><a href='/secondpage'>Вторая страница</a>"
  },
  {
    name: "icon",
    text: "Адаптивная иконка",
    status: false,
    func: function () {
      return document.querySelector("#iconcheck").checked || localStorage.getItem("icon") == "true";
    },
    style: dialogStyle,
    content: "<h2>Адаптивная иконка</h2>Изображение, используемое в качестве иконки приложения должно быть точно вписано в рамку иконки. Любая надпись, персонаж или предмет на изображении не должны быть обрезаны. Сама иконка не должна иметь белых полей.<br><br><div><input type='checkbox' id='iconcheck' name='iconcheck'><label for='iconcheck'>Иконка выглядит верно</label></div>"
  },
  {
    name: "datarequest",
    text: "Запрос на отсле­живание данных",
    status: false,
    func: function () {
      return document.querySelector("#datarequestcheck").checked || ua.os.name != 'iOS' || localStorage.getItem("datarequest") == "true";
    },
    style: dialogStyle,
    content: "<h2>Запрос на отсле­живание данных</h2>Приложение должно запрашивать доступ к отслеживанию данных пользователя перед запуском вебвью.<br><br><div><input type='checkbox' id='datarequestcheck' name='datarequestcheck'><label for='datarequestcheck'>Приложение запрашивает доступ к отслеживанию данных</label></div>"
  },
  {
    name: "pushrequest",
    text: "Запрос на отправку уведомлений",
    status: false,
    func: function () {
      return document.querySelector("#pushrequestcheck").checked || localStorage.getItem("pushrequest") == "true";
    },
    style: dialogStyle,
    content: "<h2>Запрос на отправку уведомлений</h2>Приложение должно отображать экран с предложением получать уведомления перед запуском вебвью.<br><br>Данный экран содержит две кнопки.<br>Кнопка подтверждения запускает диалог с запросом разрешения на отправку уведомлений.<br>Кнопка 'not now' закрывает экран, после чего в следующий раз экран снова отобразиться при запуске приложения через 3 дня.<br><br><div id='pushrequestcheckblock' style='display:none;'><input type='checkbox' id='pushrequestcheck' name='pushrequestcheck'><label for='pushrequestcheck'>Экран работает верно</label></div>",
    script: function () {
      if (Date.now() - Number.parseInt(localStorage.firststart) >= 3 * 24 * 60 * 60 * 1000) {
        document.querySelector("#pushrequestcheckblock").style.display = "block";
      }
    }
  },  
  {
    name: "webviewclosing",
    text: "Кнопка/жест Назад",
    status: false,
    func: function () {
      return document.querySelector("#webviewclosingcheck").checked || localStorage.getItem("webviewclosing") == "true";
    },
    style: dialogStyle,
    content: "<h2>Кнопка/жест Назад</h2>Кнопка или жест Назад должны вызывать возврат на прошлую страницу, если она есть. Возврат назад с первой страницы сайта не должен закрывать вебвью.<br><br><div><input type='checkbox' id='webviewclosingcheck' name='webviewclosingcheck'><label for='webviewclosingcheck'>Функция работает верно</label></div>"
  },
  {
      name: "deeplink",
      text: "Переход по диплинку",
      status: false,
      func: function () {
          return document.querySelector("#deeplinkcheck").checked || localStorage.getItem("deeplink") == "true";
      },
      style: dialogStyle,
      content: "<h2>Переход по диплинку</h2> Приложение должно поддерживать переход по диплинкам из вебвью. <br>Для проверки указанных ниже диплинков на устройство должно быть предварительно установлено соответствующее приложение.<br>При возврате в приложение в вебвью не должна отображаться ошибка.<br><br><div style='display: flex; flex-direction: row; gap: .5em; justify-content: center;'> <img src='https://play-lh.googleusercontent.com/6_Qan3RBgpJUj0C2ct4l0rKKVdiJgF6vy0ctfWyQ7aN0lBjs78M-1cQUONQSVeo2jfs' style='width: 100px; border-radius: 16px;'> <div style='display: flex; flex-direction: column; gap: .5em; align-items: start; justify-content: center;'> <a href='paytmmp://pay'>paytmmp://</a> <a href='https://apps.apple.com/ru/app/paytm-secure-upi-payments/id473941634'>App Store</a> <a href='https://play.google.com/store/apps/details/Paytm_UPI_Money_Transfer_Recharge_Bill_Payment?id=net.one97.paytm&hl=ru'>Google Play</a> </div></div><div style='display: flex; flex-direction: row; gap: .5em; justify-content: center;'> <img src='https://play-lh.googleusercontent.com/6iyA2zVz5PyyMjK5SIxdUhrb7oh9cYVXJ93q6DZkmx07Er1o90PXYeo6mzL4VC2Gj9s' style='width: 100px; border-radius: 16px;'> <div style='display: flex; flex-direction: column; gap: .5em; align-items: start; justify-content: center;'> <a href='phonepe://pay'>phonepe://</a> <a href='https://apps.apple.com/ru/app/phonepe-secure-payments-app/id1170055821?mt=8'>App Store</a> <a href='https://play.google.com/store/apps/details?id=com.phonepe.app&hl=ru'>Google Play</a> </div></div><div style='display: flex; flex-direction: row; gap: .5em; justify-content: center;'> <img src='https://play-lh.googleusercontent.com/V1dkOTY_G9orFZHFtVYrDN-pbz1SGLM4D3RjjAL1WgEAhXVZa4o6O9mU09dJU1x5Ao8' style='width: 100px; border-radius: 16px;'> <div style='display: flex; flex-direction: column; gap: .5em; align-items: start; justify-content: center;'> <a href='bankid:///?'>bankid://</a> <a href='https://apps.apple.com/ru/app/bankid-s%C3%A4kerhetsapp/id433151512?ls=1'>App Store</a> <a href='https://play.google.com/store/apps/details?id=com.bankid.bus&hl=fi'>Google Play</a> </div></div><div><input type='checkbox' id='deeplinkcheck' name='deeplinkcheck'><label for='deeplinkcheck'>Переходы по дипликам и возврат в приложение работают верно</label></div>"
  },
  {
    name: "protectedid",
    text: "Protected Media ID",
    status: false,
    func: function () {
      
    },
    style: dialogStyle,
    script: function () {
      const clearKeyOptions = [
        {
          initDataTypes: ["keyids", "webm"],
          audioCapabilities: [
            { contentType: 'audio/webm; codecs="opus"' },
            { contentType: 'audio/webm; codecs="vorbis"' },
          ],
          videoCapabilities: [
            { contentType: 'video/webm; codecs="vp9"' },
            { contentType: 'video/webm; codecs="vp8"' },
          ],
        },
      ];
      
      navigator
        .requestMediaKeySystemAccess("org.w3.clearkey", clearKeyOptions)
        .then((keySystemAccess) => {
          console.log("Have keys");
        });
    },
    content: "<h2>Автоматическое разрешение запросов к Protected Media ID</h2>Приложение должно разрешать доступ к Protected Media ID без появления попапа.<br><br><div></div>"
};

window.siteUnits = [
  {
    name: "ninecasino",
    link: "https://ninecasinogo.com"
  }
];

function copy() {
  // console.log(this);
  var copyText = document.querySelector("#pushlink");
  copyText.select();
  document.execCommand("copy");
}

const unitsBlock = document.querySelector("#units");

function addUnitButton(unit) {
  let div = document.createElement("div");
  div.classList.add("unit");
  div.id = unit.name;
  let span = document.createElement("span");
  span.innerText = unit.text;
  div.append(span);
  let dialog = document.createElement("dialog");
  dialog.style = unit.style;
  dialog.innerHTML = unit.content;
  div.append(dialog);
  div.addEventListener("click", function ({ currentTarget, target }) {
    if (target === div || target === span) {
      dialog.showModal();
    }
  });
  dialog.addEventListener('click', function (event) {
    const rect = dialog.getBoundingClientRect();
    if (!(rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width)) {
      dialog.close();
    }
  });
  unitsBlock.append(div);
  if (unit.script) {
    unit.script.call();
  }
}

function addSiteButton(unit) {
  let a = document.createElement("a");
  a.setAttribute("href", unit.link);
  a.classList.add("site");
  a.id = unit.name;
  a.style.order = window.testUnits.length * 2;
  unitsBlock.append(a);
}

document.body.onload = () => {
    
  unitsBlock.innerHTML = "";
  
  for (let [index, unit] of window.testUnits.entries()) {
    unit.status = localStorage.getItem(unit.name) == 'true' ? true : false;
  }
  
  for (let unit of window.testUnits) {
    addUnitButton(unit);
  }
  
  for (let unit of window.siteUnits) {
    addSiteButton(unit);
  }
  
  checkScreenOrientation();

  setInterval(function () { 
    
    for (let [index, unit] of window.testUnits.entries()) {
      if (unit.func) {
        unit.status = unit.func.call();
        localStorage.setItem(unit.name, unit.status);
      }
      const unitBlock = document.querySelector("#" + unit.name);
      unitBlock.style.order = index + (unit.status == true ? window.testUnits.length : 0);
      if (unit.status) {
        unitBlock.classList.add("done");
      } else {
        unitBlock.classList.remove("done");
      }
    }
    
  }, 1000);
  
}

setInterval(function () { 
  let percent = document.querySelector("#percent");
  let value = Number(percent.innerText);
  percent.innerText = Math.round(value + Math.sign(Math.round((window.testUnits.filter(e => e.status == true).length / window.testUnits.length) * 100) - value));
}, 10);

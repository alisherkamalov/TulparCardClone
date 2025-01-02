<template>
  <div class="container">
    <section class="container-info">
      <div class="info">
        <svg viewBox="0 0 500 500" preserveAspectRatio="xMinYMin meet" class="wave">
          <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z" style="stroke: none; fill: #8ab4f5;"></path>
        </svg>
        <span class="balance">{{ state.balance }} ₸</span>
        <div class="trips">
          ~{{ tripsRemaining }} поездок
        </div>
        <div class="right">
          Virtual (** {{ state.virtualNumber }})
          <span class="base">Ед. базовый</span>
        </div>
      </div>
      <div class="sizedbox"></div>
    </section>
    <section class="add-ts-cart">
      <button class="btntscart" @click="createTicket">
        + Добавить транспортную карту
      </button>
      <div class="sizedbox"></div>
    </section>
    <section class="other-feature">
      <div class="features">
        <div class="feature" v-for="(featureso, index) in featuresone" :key="index">
          <img :src="featureso.imgSrc" alt="" class="trans">
          <div class="texts">
            <span class="head">{{ featureso.head }}</span>
            <span class="title">{{ featureso.title }}</span>
          </div>
          <button class="next">
            <img src="../assets/next.png" alt="" class="img-next">
          </button>
        </div>
        <div class="feature" v-for="(featurest, index) in featurestwo" :key="index">
          <div class="trans two"><span class="logotext">{{ featurest.logo }}</span></div>
          <div class="texts">
            <span class="head">{{ featurest.head }}</span>
            <span class="title">{{ featurest.title }}</span>
          </div>
          <button class="next">
            <img src="../assets/next.png" alt="" class="img-next">
          </button>
        </div>
      </div>
      <div class="sizedbox"></div>
    </section>
  </div>
  <footer>
    <section class="paytransit">
      <div class="dots">
        •
        <span class="center-dot">•</span>
        •
      </div>
      <button class="btnpay" @click="createTicket"><img src="../assets/qr.png" alt="" class="qr"><span
          class="paytext">ОПЛАТИТЬ ПРОЕЗД</span></button>
    </section>
    <nav>
      <ul class="naviul">
        <li class="navigate home">
          <img src="../assets/logohome.jpg" alt="" class="imgnav homen">
          <span class="navtext homen">Главная</span>
        </li>
        <li class="navigate ticket" @click="router.push('/tickets')">
          <img src="../assets/ticketblack.png" alt="" class="imgnav ticketn">
          <span class="navtext ticket">Мои билеты</span>
        </li>
        <li class="navigate map">
          <img src="../assets/busblack.png" alt="" class="imgnav bus">
          <span class="navtext">Маршруты</span>
        </li>
        <li class="navigate noti">
          <img src="../assets/notiblack.png" alt="" class="imgnav noti">
          <span class="navtext noti">Уведомления</span>
        </li>
        <li class="navigate settings">
          <img src="../assets/setblack.png" alt="" class="imgnav set">
          <span class="navtext set">Настройки</span>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script setup>
import { reactive, computed, watch, onMounted, ref } from 'vue';
import router from '@/router';

const TICKET_COST = 85;

const getBalanceFromLocalStorage = () => {
  const storedBalance = localStorage.getItem('balance');
  return storedBalance ? parseFloat(storedBalance) : 8500;
};

const setBalanceToLocalStorage = (balance) => {
  localStorage.setItem('balance', balance);
};

const generateRandomNumber = () => Math.floor(Math.random() * 100);

const getRandomNumberFromLocalStorage = () => {
  const storedNumber = localStorage.getItem('virtualNumber');
  return storedNumber ? parseInt(storedNumber) : generateRandomNumber();
};

const setRandomNumberToLocalStorage = (number) => {
  localStorage.setItem('virtualNumber', number);
};

const state = reactive({
  balance: getBalanceFromLocalStorage(),
  virtualNumber: getRandomNumberFromLocalStorage(),
});

const tripsRemaining = computed(() => Math.floor(state.balance / TICKET_COST));

const featuresone = [
  {
    imgSrc: require('@/assets/trans.png'),
    head: "Перевести",
    title: "На другую карту"
  },
  {
    imgSrc: require('@/assets/time.png'),
    head: "История",
    title: "Всех транзакций"
  },
];

const featurestwo = [
  {
    head: "Пополнить",
    title: "Баланс карты",
    logo: '+'
  },
  {
    head: "Доп. функции",
    title: "Редактировать, удалить и т.п",
    logo: '•••'
  },
];

const createTicket = () => {
  if (state.balance >= TICKET_COST) {
    state.balance -= TICKET_COST;
    setBalanceToLocalStorage(state.balance);
    router.push('/confirm');
  } else {
    state.balance = 8500;
    setBalanceToLocalStorage(state.balance);
    router.push('/confirm');
  }
};

watch(() => state.balance, (newBalance) => {
  if (newBalance <= 0) {
    state.balance = 8500;
    setBalanceToLocalStorage(state.balance);
  }
});

const busInformation = ref(JSON.parse(localStorage.getItem('busInformation')) || []);

const checkOverdueTickets = () => {
  const currentTime = new Date().getTime();
  busInformation.value.forEach((ticket) => {
    if (currentTime - ticket.startTime >= 40 * 60 * 1000 && !ticket.overdue) {
      ticket.overdue = true;
      localStorage.setItem('busInformation', JSON.stringify(busInformation.value));
    }
  });
};

onMounted(() => {
  checkOverdueTickets();
  if (!localStorage.getItem('virtualNumber')) {
    const randomNumber = generateRandomNumber();
    state.virtualNumber = randomNumber;
    setRandomNumberToLocalStorage(randomNumber);
  }
});
</script>





<style scoped>
.info {
  margin-top: 22px;
  margin-left: 12px;
  min-width: 346px;
  width: 100%;
  height: 110px;
  border-radius: 15px;
  background-color: #7f92f2;
  position: relative;
  overflow: hidden;
  color: white;
  font-size: 42px;
  font-weight: 500;
}

.sizedbox {
  width: 12px;
}

.balance {
  margin-left: 15px;
  translate: 0px 0px;
  display: flex;
  z-index: 2;
  position: relative;
}

.wave {
  position: absolute;
  bottom: -15px;
  left: 0;
  z-index: 1;
  transform: scaleX(-1) rotate(180deg);
  opacity: 0.5;
  fill: rgba(255, 255, 255, 0.3);
  /* Полупрозрачный цвет для стеклянного эффекта */
  backdrop-filter: blur(10px);
  /* Размытие фона позади волны */
  -webkit-backdrop-filter: blur(10px);
  /* Для поддержки в WebKit-браузерах */
}

.container-info {
  width: 100%;
  display: flex;
}

.trips {
  width: 119px;
  position: relative;
  height: 29px;
  display: flex;
  z-index: 1;
  justify-content: center;
  align-items: center;
  margin-top: 2.5px;
  margin-left: 15px;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.37);
  border-radius: 7px;
  font-size: 16px;
  font-weight: 300;
  font-family: 'ArabN';
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
}

.right {
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 15px;
  top: 15px;
  text-align: right;
  font-size: 15px;
  z-index: 2;
  font-weight: normal;
}

.base {
  margin-top: 10px;
  font-family: 'ArabN';
  font-weight: normal;
  font-size: 17px;
}

.btntscart {
  margin-left: 12px;
  margin-top: 8px;
  padding-top: 4px;
  padding-bottom: 6px;
  display: flex;
  width: 100%;
  display: flex;
  font-size: 15px;
  border: 0;
  cursor: pointer;
  justify-content: center;
  background-color: #efeef1;
  font-family: 'ArabN';
  border-radius: 17px;
}

.add-ts-cart {
  width: 100%;
  display: flex;
}

.other-feature {
  display: flex;
  width: 100%;
  margin-top: 21px;
}

.features {
  min-width: 345px;
  width: 100%;
  margin-left: 12px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.container {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  width: 100%;

}

.feature {
  padding-top: 19px;
  padding-left: 19px;
  padding-right: 19px;
  padding-bottom: 15px;
  gap: 16px;
  display: flex;
  position: relative;
  border-bottom: 1px solid #edecef;
}

.trans {
  width: 37px;
  height: 37px;
}

.head {
  font-family: 'ArabN';
  font-size: 15px;
  font-weight: normal;
}

.title {
  font-family: 'ArabN';
  font-size: 13px;
  font-weight: normal;
  color: #a0a0a5;
}

.texts {
  display: flex;
  flex-direction: column;
}

.next {
  border: 0;
  background-color: transparent;
  width: 10px;
  height: 10px;
  position: absolute;
  top: 32px;
  right: 22px;
}

.img-next {
  width: 10px;
  height: 10px;
}

.trans.two {
  background-color: #f6ad32;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.logotext {
  font-family: 'ArabN';
}

.paytransit {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.dots {
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: center;
  color: #f6d9d4;
  font-size: 35px;
}

.center-dot {
  color: #c83a29;
}

footer {
  width: 100%;
  min-height: 150px;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.btnpay {
  width: 93%;
  height: 44px;
  color: white;
  font-family: 'Arab';
  font-size: 16px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  background-color: #c83a29;
  border: 0;
  border-radius: 6px;
  translate: 0px -9px;
}

.qr {
  width: 32px;
  translate: -11px 0px;
}

.paytext {
  translate: -4px 10px;
}

.naviul {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 18px;
  background-color: white;
  text-decoration: none;
}

.navigate {
  display: flex;
  width: 60px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  font-family: 'ArabN';
}

.navigate.home {
  color: #c7695c;
}

.imgnav {
  width: 35px;
}

.homen {
  translate: 5px 12px;
}

.navtext {
  padding: 10px;
  translate: 5px 1px;
}

.navtext.homen {
  translate: 5px 5px;
  scale: 1.1;
  font-weight: 600;
}

.navtext.ticket {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 0px;
  padding-right: 0px;
  white-space: nowrap;
}

.ticketn {
  width: 20px;
  translate: 3px 16px;
  margin-bottom: 8px;
}

.bus {
  width: 20px;
  translate: 3px 16px;
  margin-bottom: 8px;
}

.imgnav.noti {
  width: 25px;
  translate: 3px 12px;
}

.navtext.noti {
  translate: 5px 2px;
}

.imgnav.set {
  width: 20px;
  translate: 3px 15px;
}

.navtext.set {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 0px;
  padding-right: 0px;
  translate: 5px 9px;
}

.navigate.settings {
  translate: -10px 0px;
}

.navigate.noti {
  translate: -8px 0px;
}

.navigate.map {
  translate: -8px 0px;
}

.navigate.ticket {
  translate: -5px 0px;
}
</style>
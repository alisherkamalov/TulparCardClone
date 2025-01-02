<template>

    <body>
        <div class="container">
            <header>
                <span class="headertitle">Мои билеты</span>
            </header>

            <!-- Отображение всех билетов -->
            <div v-for="ticket in tickets" :key="ticket.id" class="ticketbus" @click="openTicket(ticket)">
                <div class="center">
                    <img src="../assets/virtual.png" alt="" class="virtualimg" />
                </div>
                <div class="ticket-info">
                    <div class="ticket-details">
                        <div class="infobuss">
                            <div class="infocont">
                                <img src="../assets/costs.png" alt="" class="infoimg" />
                                <span class="title">Цена</span>
                            </div>
                            <span class="conclusion">{{ ticket.cost }}</span>
                        </div>
                        <div class="infobuss">
                            <div class="infocont busss">
                                <img src="../assets/busblack.png" alt="" class="infoimg" />
                                <span class="title">Номер автобуса</span>
                            </div>
                            <span class="conclusion busss">{{ ticket.number }}</span>
                        </div>
                        <div class="infobuss">
                            <div class="infocont routee">
                                <img src="../assets/route.png" alt="" class="infoimg" />
                                <span class="title">Маршрут</span>
                            </div>
                            <span class="conclusion routee">{{ ticket.route }}</span>
                        </div>
                        <div class="line"></div>
                        <div class="bottominfo" :class="{
                            'new-ticket': isNewestTicket(ticket),
                            'overdue-ticket': ticket.overdue,
                            'not-new-ticket': isNotNewestTicket(ticket),
                            'no-flash': !(isNewestTicket(ticket) && !ticket.overdue)
                        }">

                            <div class="conttime" :class="{ 'overdue-text': ticket.overdue }">
                                Время
                                <span class="bottominfotext" :class="{ 'overdue-color': ticket.overdue }">
                                    {{ formatTime(ticket.createdAt) }}
                                </span>
                            </div>
                            <div class="contdate" :class="{ 'overdue-text': ticket.overdue }">
                                Дата
                                <span class="bottominfotext" :class="{ 'overdue-color': ticket.overdue }">
                                    {{ formatDate(ticket.date) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sizedboxbottom"></div>
        </div>

        <!-- Навигация внизу -->
        <footer>
            <nav>
                <ul class="naviul">
                    <li class="navigate home" @click="router.push('/')">
                        <img src="../assets/logohomeblack.png" alt="" class="imgnav homen" />
                        <span class="navtext homen">Главная</span>
                    </li>
                    <li class="navigate ticket">
                        <img src="../assets/ticketred.png" alt="" class="imgnav ticketn" />
                        <span class="navtext ticket">Мои билеты</span>
                    </li>
                    <li class="navigate map">
                        <img src="../assets/busblack.png" alt="" class="imgnav bus" />
                        <span class="navtext">Маршруты</span>
                    </li>
                    <li class="navigate noti">
                        <img src="../assets/notiblack.png" alt="" class="imgnav noti" />
                        <span class="navtext noti">Уведомления</span>
                    </li>
                    <li class="navigate settings">
                        <img src="../assets/setblack.png" alt="" class="imgnav set" />
                        <span class="navtext set">Настройки</span>
                    </li>
                </ul>
            </nav>
        </footer>
    </body>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import router from '@/router';
document.body.style.overflow = '';
const tickets = ref(JSON.parse(localStorage.getItem('busInformation'))?.reverse() || []);

const openTicket = (ticket) => {
    router.push({ name: 'TheTicket', params: { ticketId: ticket.id } });
};

const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

const formatDate = (date) => {
    const [day, month] = date.split('.').slice(0, 2);
    return `${day}.${month}`;
};

const isNotNewestTicket = (ticket) => {
    const newestTicket = tickets.value[0];
    return ticket !== newestTicket && !ticket.overdue;
};

const isNewestTicket = (ticket) => {
  const newestTicket = tickets.value[0];
  return ticket === newestTicket;
};

onMounted(() => {
    document.body.style.overflow = '';
})
</script>

<style scoped>
.container {
    width: 100%;
    height: 100dvh;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;
}

.ticketbus {
    max-width: 367px;
    width: 95%;
    min-height: 207px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 15px;
    background-color: white;
    display: flex;
    flex-direction: column;
    margin-top: 8.5px;
    position: relative;
    align-items: center;
    margin-bottom: 10px;
    overflow: hidden;
}

header {
    background-color: #c83a29;
    width: 100%;
    min-height: 51px;
    display: flex;
    gap: 15px;
    font-family: 'Inter';
    color: white;
    font-size: 20px;
    font-weight: 500;
    position: sticky;
    top: 0;
    z-index: 10;
}

.sizedboxbottom {
    width: 100%;
    min-height: 70px;
}

.headertitle {
    translate: 14px 15px;
}

.ticket-details {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.ticket-info {
    width: 100%;
}

.infoimg {
    width: 25px;
    scale: 0.8;
}

.infobuss {
    width: 90%;
    display: flex;
    justify-content: space-between;
    margin-top: 17px;
    translate: -5px;
}

.center {
    width: 100%;
    display: flex;
    justify-content: center;
}

.virtualimg {
    width: 75px;
    position: absolute;
    top: 3px;
}

.infocont {
    display: flex;
    gap: 15px;
    font-weight: 400;
    font-family: 'ArabN';
}

.title {
    translate: -8px;
}

.conclusion {
    font-family: 'ArabN';
    font-weight: 400;
    color: #89888f;
    translate: 12px;
}

.infocont.busss {
    translate: 0px -5px;
}

.conclusion.busss {
    translate: 12px -4px;
}

.infocont.routee {
    translate: 0px -10px;
}

.conclusion.routee {
    translate: 10px -9px;
}

.bottominfo {
    display: flex;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 71px;
    justify-content: space-between;
    transition: background-color 0.5s ease;
}

/* Анимация применяется только к самому новому билету */
.bottominfo.new-ticket {
  animation: flash-color 1s infinite;
}

@keyframes flash-color {
  0% {
    background-color: #c83a29;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    background-color: #c83a29;
  }
}

/* Убираем анимацию для остальных билетов */
.bottominfo:not(.new-ticket) {
  background-color: white;
}


.bottominfo.overdue-ticket {
    background-color: white;
}

.conttime,
.contdate {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'ArabN';
    font-weight: 200;
    font-size: 15px;
    color: white;
    transition: color 0.5s ease;
}

.conttime.overdue-text,
.contdate.overdue-text {
    color: #b9b9bc;
}

.bottominfotext {
    font-family: 'Arab';
    transition: color 0.5s ease;
    translate: -1px 2px;
}

.bottominfotext.overdue-color {
    color: #cb3a2a;
}

.conttime {
    translate: 30px 13px;
}

.contdate {
    translate: -26px 13px;
}

.bottominfo.not-new-ticket {
    background-color: white;
}

.conttime.not-new-ticket,
.contdate.not-new-ticket {
    color: #b9b9bc;
}

.bottominfotext.not-new-ticket {
    color: #cb3a2a;
}

.line {
    height: 1px;
    width: 100%;
    background: repeating-linear-gradient(to right,
            #f2f2f2,
            #f2f2f2 10px,
            transparent 10px,
            transparent 20px);
    translate: 0px 7px;
}

.bottominfo.no-flash {
    background-color: white;
}

.bottominfo.no-flash .conttime,
.bottominfo.no-flash .contdate {
    color: #b9b9bc;
    /* Цвет для времени и даты */
}

.bottominfo.no-flash .bottominfotext {
    color: #cb3a2a;
    /* Цвет для текста времени и даты */
}


footer {
    display: flex;
    position: absolute;
    bottom: 0;
    width: 100%;
    justify-content: center;
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
    color: black;
}

.imgnav {
    width: 35px;
}

.homen {
    translate: 5px 13px;
}

.navtext {
    padding: 10px;
    translate: 5px 1px;
}

.navtext.homen {
    translate: 5px 5px;
}

.navtext.ticket {
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 0px;
    padding-right: 0px;
    white-space: nowrap;
    color: #c7695c;
    scale: 1.1;
    font-weight: 600;
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
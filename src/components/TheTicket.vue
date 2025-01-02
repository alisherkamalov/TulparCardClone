<template>

    <body>
        <div class="container">
            <header>
                <button class="back" @click="router.push('/tickets')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="arrowleft" viewBox="0 0 448 512">
                        <path fill="#ffffff"
                            d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                    </svg>
                </button>
                <span class="headertitle">Мой билет</span>
            </header>
            <section class="basicinfo">
                <div v-if="bus" class="businfo">
                    ПЕРЕВОЗЧИК
                    <span class="titlecarrier">ТОО "СапарТранс2012"</span>
                    <div class="line"></div>
                    <p class="infop">Номер автобуса</p>
                    <span class="oneinfo bus">{{ bus.number }}</span>
                    <div class="line"></div>
                    <p class="infop time">Время</p>
                    <span class="oneinfo time">{{ bus.createdAt }}</span>
                    <div class="line"></div>
                    <ul>
                        <li>
                            <p class="infopt">Дата оплаты</p>
                            <span class="twoinfo">{{ bus.date }}</span>
                        </li>
                        <li>
                            <p class="infopt">Стоимость</p>
                            <span class="twoinfo">
                                {{ bus.cost }} ₸
                            </span>
                        </li>
                        <li class="codebus">
                            <p class="infopt busss">Код автобуса</p>
                            <span class="twoinfo">{{ bus.code }}</span>
                        </li>
                        <li class="routebus">
                            <p class="infopt">Маршрут</p>
                            <span class="twoinfo">{{ bus.route }}</span>
                        </li>
                    </ul>
                    <span class="threeinfo">{{ bus.randomCode }}</span>
                    <div :class="['bottom', bus.overdue ? 'overdue' : 'active']">
                        <p v-if="!bus.overdue" class="activetime">00:{{ bus.remainingTimeFormatted }}</p>
                        <p v-else class="overdue">ПРОСРОЧЕН</p>
                    </div>
                </div>
                <p v-else>Билет не найден.</p>
            </section>
            <div class="sizedbox"></div>
        </div>
    </body>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const ticketId = parseInt(route.params.ticketId, 10);
const bus = ref(null);
let timer = null;

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const loadBusInfo = () => {
    const busData = JSON.parse(localStorage.getItem('busInformation')) || [];
    return busData.find(bus => bus.id === ticketId);
};

const startTimer = () => {
    timer = setInterval(() => {
        if (bus.value && !bus.value.overdue) {
            bus.value.remainingTime -= 1;
            if (bus.value.remainingTime <= 0) {
                bus.value.overdue = true;
                bus.value.remainingTime = 0;
            }
            bus.value.remainingTimeFormatted = formatTime(bus.value.remainingTime);

            const busData = JSON.parse(localStorage.getItem('busInformation')) || [];
            const index = busData.findIndex(b => b.id === ticketId);
            if (index !== -1) {
                busData[index] = bus.value;
                localStorage.setItem('busInformation', JSON.stringify(busData));
            }
        }
    }, 1000);
};

onMounted(() => {
    const busData = loadBusInfo();
    if (busData) {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - busData.startTime) / 1000);
        busData.remainingTime -= elapsedTime;

        if (busData.remainingTime <= 0) {
            busData.overdue = true;
            busData.remainingTime = 0;
        }

        busData.remainingTimeFormatted = formatTime(busData.remainingTime);
        bus.value = busData;
        startTimer();
    }
});

onUnmounted(() => {
    if (timer) {
        clearInterval(timer);
    }
});
</script>




<style scoped>
.container {
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.bus-info {
    margin-bottom: 20px;
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
    z-index: 2;
}

.arrowleft {
    width: 16px;
    margin-left: 18px;
    margin-top: 3px;
}

.headertitle {
    translate: 16px 14.1px;
}

.back {
    border: 0;
    background-color: transparent;
}

.basicinfo {
    max-width: 367px;
    width: 92%;
    min-height: 658px;
    border-radius: 15px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin-top: 15px;
    display: flex;
    position: relative;
    overflow: hidden;
    justify-content: center;
    translate: -1px 0px;
}

.businfo {
    width: 90%;
    font-family: 'Arab';
    font-weight: 400;
    translate: 4px 19px;
    font-size: 20px;
    display: flex;
    flex-direction: column;
}

.titlecarrier {
    font-size: 15px;
    color: black;
    font-weight: 400;
    font-family: 'Inter';
    margin-top: 9px;
    margin-bottom: 16px;
}

.line {
    width: 102%;
    height: 1px;
    background-color: #efefef;
    translate: -7px;
}

p {
    font-size: 14.2px;
    font-family: 'Inter';
    color: #848484;
}

.infop {
    translate: -3.5px;
    margin-top: 16px;
}

.oneinfo {
    font-size: 50px;
    font-family: 'Arab';
}

.oneinfo.bus {
    margin-bottom: 15px;
    display: flex;
}

.infop.time {
    display: flex;
    margin-top: 17px;
}

.oneinfo.time {
    display: flex;
    margin-bottom: 15px;
}

ul {
    display: flex;
    translate: -3.5px;
    margin-top: 17px;
    gap: 12px;
    flex-wrap: wrap;
}

.infopt {
    translate: 0px 1px;
}

.twoinfo {
    font-weight: 300;
}

.codebus {
    text-align: center;
    translate: 18px;

}

.routebus {
    width: 60px;
    word-wrap: break-word;
    translate: 0px 3px;
}

.threeinfo {
    font-size: 15px;
    font-family: 'ArabN';
    width: 98%;
    display: flex;
    min-height: 22px;
    font-weight: 600;
    justify-content: center;
    margin-top: 19px;
    position: fixed;
    bottom: 120px;
}

.bottom {
    width: 112%;
    display: flex;
    height: 87px;
    justify-content: center;
    align-items: center;
    position: fixed;
    translate: 0px 20px;
    left: -22px;
    bottom: 38px;
}

.overdue {
    font-size: 30px;
    color: white;
}

.bottom.active {
    background-color: #43c435;
}

.bottom.overdue {
    background-color: #ccc;
}

.sizedbox {
    display: flex;
    width: 100%;
    min-height: 25px;
}

.activetime {
    font-size: 30px;
    color: white;
    font-weight: 600;
    translate: -3px;
}
</style>
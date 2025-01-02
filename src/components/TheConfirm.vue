<template>
    <transition name="fade">
        <div v-if="showContainerOne" class="container-one">
            Введите номер автобуса! Это обязательное действие
            <div class="passcode">
                <div class="cell">
                    <input type="text" v-model="busNumber" @change="saveBusInfo">
                </div>
            </div>
            <button class="random-number" @click="generateRandomBusNumber">Создать случайный номер</button>
            <button class="next" @click="toBusCode">Подтвердить</button>
        </div>
    </transition>
    <transition name="fade">
        <div v-if="showContainerTwo" class="container-two">
            Введите код автобуса! Это обязательное действие
            <div class="passcode">
                <div class="cell">
                    <input type="text" v-model="busCode" @change="saveBusInfo">
                </div>
            </div>
            <button class="next" @click="toRoute">Подтвердить</button>
        </div>
    </transition>
    <transition name="fade">
        <div v-if="showContainerThree" class="container-three">
            Введите маршрут! Это обязательное действие
            <div class="passcode">
                <div class="cell">
                    <input type="text" v-model="busRoute" @change="saveBusInfo">
                </div>
            </div>
            <button class="next" @click="finalizeBusInfo">Подтвердить</button>
        </div>
    </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const showContainerOne = ref(true);
const showContainerTwo = ref(false);
const showContainerThree = ref(false);
const busNumber = ref('');
const busCode = ref('');
const busRoute = ref('');
const busInformation = ref(JSON.parse(localStorage.getItem('busInformation')) || []);

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const getCurrentTimeFormatted = () => {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

const saveBusInfo = () => {
    const currentTime = new Date();
    const formattedDate = `${currentTime.getDate().toString().padStart(2, '0')}.${(currentTime.getMonth() + 1).toString().padStart(2, '0')}.${currentTime.getFullYear()}`;
    const startTime = currentTime.getTime();
    const createdAt = getCurrentTimeFormatted();
    const index = busInformation.value.length;
    const currentBusInfo = {
        number: busNumber.value,
        code: busCode.value,
        route: busRoute.value,
        date: formattedDate,
        cost: 85,
        randomCode: crypto.randomUUID(),
        overdue: false,
        remainingTime: 40 * 60,
        remainingTimeFormatted: formatTime(40 * 60),
        startTime: startTime,
        createdAt: createdAt,
        id: index + 1,
    };

    const existingIndex = busInformation.value.findIndex(info => info.number === busNumber.value);
    if (existingIndex !== -1) {
        busInformation.value[existingIndex] = currentBusInfo;
    } else {
        busInformation.value.push(currentBusInfo);
    }

    busInformation.value = busInformation.value.filter(info => info.number && info.code && info.route);
    localStorage.setItem('busInformation', JSON.stringify(busInformation.value));
    updateTimer(currentBusInfo);
};

const updateTimer = (busInfo) => {
    const interval = setInterval(() => {
        if (busInfo.remainingTime > 0) {
            busInfo.remainingTime -= 1;
            busInfo.remainingTimeFormatted = formatTime(busInfo.remainingTime);
            localStorage.setItem('busInformation', JSON.stringify(busInformation.value));
        } else {
            busInfo.overdue = true;
            localStorage.setItem('busInformation', JSON.stringify(busInformation.value));
            clearInterval(interval);
        }
    }, 1000);
};

const toBusCode = () => {
    if (busNumber.value.trim() === '') {
        alert('Пожалуйста, введите номер автобуса!');
        return;
    }
    showContainerOne.value = false;
    setTimeout(() => {
        showContainerTwo.value = true;
    }, 500);
};

const toRoute = () => {
    if (busCode.value.trim() === '') {
        alert('Пожалуйста, введите код автобуса!');
        return;
    }
    showContainerTwo.value = false;
    setTimeout(() => {
        showContainerThree.value = true;
    }, 500);
};

const finalizeBusInfo = () => {
    if (busRoute.value.trim() === '') {
        alert('Пожалуйста, введите маршрут!');
        return;
    }
    saveBusInfo();
    router.push('/tickets');
};

const generateRandomBusNumber = () => {
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const randomLetters = String.fromCharCode(
        65 + Math.floor(Math.random() * 26),
        65 + Math.floor(Math.random() * 26)
    );
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    busNumber.value = `${randomDigits}${randomLetters}${randomSuffix}`;
    saveBusInfo();
};
</script>




<style scoped>
.container-one,
.container-two,
.container-three {
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: 'ArabN';
    color: grey;
}

.cell {
    width: 90%;
    height: 50px;
    display: flex;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    background-color: rgb(184, 184, 184);
    border-radius: 12px;
    border: 3px solid rgb(202, 202, 202);
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

.passcode {
    display: flex;
    width: 100%;
    gap: 15px;
    justify-content: center;
    margin-top: 15px;
}

input {
    width: 60%;
    height: 40px;
    scale: 1.5;
    background-color: rgb(184, 184, 184);
    border: 0;
    font-family: 'Arab';
}

input:focus {
    outline: none;
    border: none;
}

button {
    background-color: #c83a29;
    margin-top: 15px;
    width: 150px;
    height: 50px;
    border: 0;
    color: white;
    font-size: 15px;
    border-radius: 15px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

.randomcode {
    white-space: nowrap;
    width: 200px;
    position: absolute;
    bottom: 15px;
}

.cell.bus {
    width: 50%;
}

.numbus {
    width: 30%;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.5);
}
</style>

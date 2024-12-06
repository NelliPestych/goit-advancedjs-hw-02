import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Елементи інтерфейсу
const datePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('button[data-start]');
const daysField = document.querySelector('span[data-days]');
const hoursField = document.querySelector('span[data-hours]');
const minutesField = document.querySelector('span[data-minutes]');
const secondsField = document.querySelector('span[data-seconds]');

let timerId = null;
let userSelectedDate = null;

// Параметри для flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();

    if (selectedDate <= currentDate) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.disabled = true;
      return;
    }

    userSelectedDate = selectedDate;
    startButton.disabled = false;
  },
};

// Ініціалізація flatpickr
flatpickr(datePicker, options);

// Додаткові функції
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  daysField.textContent = addLeadingZero(days);
  hoursField.textContent = addLeadingZero(hours);
  minutesField.textContent = addLeadingZero(minutes);
  secondsField.textContent = addLeadingZero(seconds);
}

function startTimer() {
  startButton.disabled = true;
  datePicker.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();
    const timeDifference = userSelectedDate - currentTime;

    if (timeDifference <= 0) {
      clearInterval(timerId);
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      iziToast.success({
        title: 'Done',
        message: 'The countdown has finished!',
        position: 'topRight',
      });
      datePicker.disabled = false;
      return;
    }

    const time = convertMs(timeDifference);
    updateTimerInterface(time);
  }, 1000);
}

// Обробник подій для кнопки "Start"
startButton.addEventListener('click', startTimer);
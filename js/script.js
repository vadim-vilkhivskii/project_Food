window.addEventListener('DOMContentLoaded', () => { //глобальный обработчик который следит чтобы сначал загрузился DOM
    //TABS
    const tabs = document.querySelectorAll('.tabheader__item'),// находим все табы 
        tabsContent = document.querySelectorAll('.tabcontent'),// находим контент этих табов
        tabsParent = document.querySelector('.tabheader__items');// находим родителя табов для делегирования событий

    function hideTabContent() {
        tabsContent.forEach((item) => { //функция для скрытия контента всех табов
            // item.style.display = 'none';//через .style.display = 'none' прячем весь контент
            item.classList.add('hide');
            item.classList.remove('show');
            item.classList.remove('fade');
        });

        tabs.forEach((item) => { //удаляем класс активности 
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {//добавляем отображение и класс активности переданому табу
        // tabsContent[i].style.display = 'block';
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');//добавляем класс активности 
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {//делегируем через родителя события
        const target = e.target;// e.target присваиваем переменной что бы часто не использовать 
        if (target && target.classList.contains('tabheader__item')) {//проверяем точно ли кликнули на нужный элемент
            tabs.forEach((item, i) => {//перебераем все переменные и если эл который находиться в псевдомасиве
                if (target == item) {  //совпадает с тем на который кликнул пользователь, тогда берем его номер 
                    hideTabContent();  // и показываем на странице. Сначала выз функ что бы скрыть всё
                    showTabContent(i); //и вызываем функцию что бы отобразить нужный элемент
                }
            });
        }
    });

    //TIMER

    const deadline = '2022-06-15';

    function getTimeRemaining(endtime) {//определяет разницу между дедлайном и текущим временем 
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());//переменная содержит рахницу между тек дат и дедлайном

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),//находим кол дней
                hours = Math.floor((t / (1000 * 60 * 60) % 24)),//находим остаток часов и отбрасываем дни
                minutes = Math.floor((t / 1000 / 60) % 60),
                seconds = Math.floor((t / 1000) % 60);
        }

        return {
            total: t,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endTime) {//установка таймера 
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),

            timeInterval = setInterval(updateClock, 1000);
        updateClock();
        function updateClock() {//функция для обновления таймера каждую секунду
            const t = getTimeRemaining(endTime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);//остановка интервала когда закончится время
            }
        }
    }

    setClock('.timer', deadline);



    //MODAL
    //Добавляем дата атрибуты элементам которые будут открывать и закрывать модальное окно
    //и находим эти элемнеты и присваиваем переменным

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', () => {//обработчик соб что бы добавлять класс show и убрать hide
            modal.classList.add('show');
            modal.classList.remove('hide');
            // modal.classList.toggle('show');//вариант черз тогл
            document.body.style.overflow = 'hidden';//при открытие мод окна обрезаем body что бы не было скрола
        });
    });


    // modalTrigger.addEventListener('click', () => {//обработчик соб что бы добавлять класс show и убрать hide
    //     modal.classList.add('show');
    //     modal.classList.remove('hide');
    //     // modal.classList.toggle('show');//вариант черз тогл
    //     document.body.style.overflow = 'hidden';//при открытие мод окна обрезаем body что бы не было скрола
    // });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimetId);
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');

        document.body.style.overflow = '';//возвращаем скрол 
    }

    modalCloseBtn.addEventListener('click', closeModal);//при нажатии на крестик скрываем мод окно
    //     modal.classList.add('hide');
    //     modal.classList.remove('show');
    //     // modal.classList.toggle('show');
    //     document.body.style.overflow = '';//возвращаем скрол 
    // });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    //закрытие мод окна при нажатии Esc
    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // const modalTimetId = setTimeout(openModal, 10000);//открываем мод окно через какое то время 

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }//когда клиент долистает до конца страницы откроеться мод окно, сумируем ск скрола вверху и высоту видимой
    }    //для этого window.pageYOffset - возвращает количество пикселей, на которое прокручен документ 
    // document.documentElement.clientHeight - видимая часть которую видит пользователь
    // и сравниваем с document.documentElement.scrollHeight высотой всего документа 
    window.addEventListener('scroll', showModalByScroll);


    //Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, perentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.perent = document.querySelector(perentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            }else{
                this.classes.forEach(classesName => element.classList.add(classesName));
            }

            element.innerHTML = `
            <img src=${this.src} alt=${this.alt}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
            `;
            this.perent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'menu__item',
        'big'

    ).render();
    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков. ',
        12,
        '.menu .container',
        'menu__item'

    ).render();
    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        14,
        '.menu .container',
        'menu__item'

    ).render();




});      

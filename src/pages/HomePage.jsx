import React from "react";
import { useNavigate } from "react-router-dom";

import heroImage from "../assets/images/FirstSectorImages.png";
import thirdImage1 from "../assets/images/ThirdSectorImage1.png";
import thirdImage2 from "../assets/images/ThirdSectorImage2.png";
import thirdImage3 from '../assets/images/ThirdSectorImage3.png'
import fourthImage from "../assets/images/FourthSectorImage.png"
import fourthMarker from "../assets/images/FourthSectorCustomMarker.png";
import budgetStep from "../assets/images/BudgetStepsImage.png";
import "../App.css";
export default function HomePage() {

  return (
    <div className="container">
      <section className="section hero">
        <div className="hero-text">
          <h1>
            Начни планировать
            <br />
            своё будущее!
          </h1>
          <p>
            В нашей компании мы помогаем частным лицам и предприятиям
            контролировать свои финансы с помощью эффективных стратегий
            составления бюджета. Присоединяйтесь к нам на пути к финансовой
            свободе и душевному спокойствию.
          </p>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Командная работа" />
        </div>
      </section>

      <section className="section">
        <h2>Расширьте возможности своего финансового будущего уже сегодня</h2>
        <p>
          Наши услуги разработаны для того, чтобы помочь вам взять под контроль
          свои финансы. Благодаря индивидуальным решениям мы направляем вас к
          достижению ваших финансовых целей.
        </p>
      </section>

      <section className="section grid-3">
        <div className="grid-item">
          <img src={thirdImage1} alt="Индивидуальное планирование"/>
          <h3>Индивидуальное финансовое планирование</h3>
          <p>
            Разработано специально для вас. Получите стратегии, соответствующие
            вашей уникальной ситуации.
          </p>
        </div>
        <div className="grid-item">
          <img src={thirdImage2} alt="Финансовый успех"/>
          <h3>Максимизация вашего потенциала</h3>
          <p>
            Достигайте своих целей быстрее с персонализированной поддержкой.
          </p>
        </div>
        <div className="grid-item">
          <img src={thirdImage3} alt="Комплексное отслеживание бюджета"/>
          <h3>Упрощённое комплексное отслеживание бюджета</h3>
          <p>
            Легко контролируйте свои расходы и оставайтесь в курсе событий.
          </p>
        </div>
      </section>


      <section className="section fourth-sector">
        <div className="fourth-sector-content">
          <h2>Раскройте свой финансовый потенциал вместе с нами</h2>
          <p>
            Наши услуги по планированию бюджета помогут вам получить контроль над
            своими финансами. Почувствуйте ясность и уверенность в своих
            финансовых решениях.
          </p>
          <ul className="list">
            <li><img src={fourthMarker} alt="-"/> Индивидуальные стратегии для вашей уникальной ситуации</li>
            <li><img src={fourthMarker} alt="-"/> Квалифицированное руководство и поддержка</li>
            <li><img src={fourthMarker} alt="-"/> Достижение целей с персональным планом</li>
          </ul>
          <button className="btn btn-accent">Начало работы</button>
        </div>
        <div className="fourth-sector-image">
          <img src={fourthImage} alt="Happy Man"/>
        </div>
      </section>

      <section className="section">
        <h2>Начало работы с нашими услугами по составлению бюджета</h2>
        <p>Наш процесс разработан так, чтобы быть простым и эффективным.</p>
        <div className="grid-3">
          <div className="card">
            <img src={budgetStep} alt="step 1"/>
            <h4>Шаг 1: Запишитесь на бесплатную консультацию</h4>
            <p>Закажите консультацию у наших экспертов</p>
          </div>
          <div className="card">
            <img src={budgetStep} alt="step 2"/>
            <h4>Шаг 2: Проанализируйте свое финансовое положение</h4>
            <p>Мы оценим ваш текущий бюджет и расходы</p>
          </div>
          <div className="card">
            <img src={budgetStep} alt="step 3"/>
            <h4>Шаг 3: Получите индивидуальный план</h4>
            <p>Вы получите рекомендации и план действий</p>
          </div>
        </div>
      </section>
    </div>
  );
}

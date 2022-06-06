"use strict";
const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const articles = require(`./articles`);
const DataService = require(`../data-service/article`);
const CommentsService = require(`../data-service/comments`);
const {HttpCode} = require(`../../constants`);
const passwordUtils = require(`../lib/password`);

const mockArticles = [
  {
    user: `ivanov@example.com`,
    comments: [
      {
        user: `petrov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
    title: `Как достигнуть успеха не вставая с кресла`,
    photo: `image1.jpg`,
    announce: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    categories: [
      `Программирование`,
      `Кино`,
      `Железо`,
      `Музыка`,
      `Деревья`,
      `Без рамки`,
      `IT`,
    ],
  },
  {
    user: `ivanov@example.com`,
    comments: [
      {
        user: `petrov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        user: `petrov@example.com`,
        text: `Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`,
      },
      {
        user: `andrewnefedov1991@gmail.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Совсем немного... Это где ж такие красоты? Мне кажется или я уже читал это где-то? Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        user: `andrewnefedov1991@gmail.com`,
        text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
    title: `Самый лучший музыкальный альбом этого года`,
    photo: `image2.jpg`,
    announce: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    categories: [`Кино`, `Музыка`],
  },
  {
    user: `petrov@example.com`,
    comments: [
      {
        user: `andrewnefedov1991@gmail.com`,
        text: `Плюсую, но слишком много буквы! Это где ж такие красоты?`,
      },
      {
        user: `andrewnefedov1991@gmail.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
    ],
    title: `Учим HTML и CSS`,
    photo: `image3.jpg`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Программировать не настолько сложно, как об этом говорят.`,
    fullText: `Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения.`,
    categories: [
      `IT`,
      `Деревья`,
      `Кино`,
      `Без рамки`,
      `Железо`,
      `Программирование`,
    ],
  },
  {
    user: `andrewnefedov1991@gmail.com`,
    comments: [
      {
        user: `ivanov@example.com`,
        text: `Плюсую, но слишком много буквы! Это где ж такие красоты? Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Планируете записать видосик на эту тему? Согласен с автором! Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        user: `ivanov@example.com`,
        text: `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Согласен с автором! Планируете записать видосик на эту тему?`,
      },
      {
        user: `ivanov@example.com`,
        text: `Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        user: `ivanov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Совсем немного... Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то? Это где ж такие красоты? Согласен с автором!`,
      },
    ],
    title: `Как перестать беспокоиться и начать жить`,
    photo: `image4.jpg`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко, если вы прирожденный герой. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    categories: [`За жизнь`, `IT`, `Деревья`, `Кино`, `Музыка`, `Железо`],
  },
  {
    user: `andrewnefedov1991@gmail.com`,
    comments: [
      {
        user: `petrov@example.com`,
        text: `Хочу такую же футболку :-) Согласен с автором!`,
      },
    ],
    title: `Как перестать беспокоиться и начать жить`,
    photo: `image5.jpg`,
    announce: `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят.`,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    categories: [`Музыка`, `Программирование`, `Железо`, `IT`],
  },
];

const mockUsers = [
  {
    email: `ivanov@example.com`,
    password: passwordUtils.hashSync(`ivanov`),
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`,
  },
  {
    email: `petrov@example.com`,
    password: passwordUtils.hashSync(`petrov`),
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`,
  },
  {
    email: `andrewnefedov1991@gmail.com`,
    password: passwordUtils.hashSync(`nefedov`),
    firstName: `Андрей`,
    lastName: `Нефедов`,
    avatar: `avatar3.jpg`,
  },
];

const mockCategories = [
  `Программирование`,
  `Кино`,
  `Железо`,
  `Музыка`,
  `Деревья`,
  `Без рамки`,
  `IT`,
  `За жизнь`,
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: true});
  const app = express();
  app.use(express.json());
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });
  articles(app, new DataService(mockDB), new CommentsService(mockDB));
  return app;
};

describe(`API создает публикацию если переданные данные валидны`, () => {
  const newArticle = {
    userId: 1,
    title: `Учим HTML и CSS без регистрации и смс`,
    photo: `photo13.jpg`,
    categories: [1, 3],
    fullText: `Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    announce: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  };

  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Статус код 201`, () => {
    expect(response.statusCode).toBe(HttpCode.CREATED);
  });

  test(`Количество публикаций изменено`, async () => {
    await request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API возвращает список публикаций`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Статус код 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Возвращает список из 5 публикаций`, () =>
    expect(response.body.length).toBe(5));

  test(`title первой публикации "Как достигнуть успеха не вставая с кресла"`, () => {
    expect(
        response.body.sort((a, b) => Number(a.id) - Number(b.id))[0].title
    ).toBe(`Как достигнуть успеха не вставая с кресла`);
  });
});

describe(`API возвращает публикацию по id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Статус код 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Заголовок публикации "Как собрать камни бесконечности"`, () =>
    expect(response.body.title).toBe(
        `Как достигнуть успеха не вставая с кресла`
    ));
});

test(`API возвращает код ответа 404 во время запроса не существующей публикации`, async () => {
  const app = await createAPI();

  return request(app).get(`/articles/1337`).expect(HttpCode.NOT_FOUND);
});

describe(`API не позволяет создать публикацию с не валидными данными`, () => {
  const newArticle = {
    title: `Учим HTML и CSS`,
    categories: [1, 3],
    fullText: `Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    announce: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.`,
  };

  test(`Если не передано какое-либо обязательное поле возвращает 400`, async () => {
    const app = await createAPI();
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
  test(`Когда данные публикации не соответствуют типу ожидаемых то возвращается 400`, async () => {
    const app = await createAPI();
    const badArticles = [
      {...newArticle, title: 123},
      {...newArticle, announce: 12345},
      {...newArticle, fullText: 12345},
      {...newArticle, categories: `звёдные войны`},
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
  test(`Когда в поле публикации передаются невалидные данные возвращается 400`, async () => {
    const app = await createAPI();
    const badArticles = [
      {...newArticle, fullText: ``},
      {...newArticle, announce: `too short`},
      {...newArticle, title: `too short`},
      {...newArticle, categories: []},
    ];
    for (const badArticle of badArticles) {
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API изменяет существующую публикацию`, () => {
  const newArticle = {
    userId: 1,
    title: `Как собрать камни бесконечности без регистрации и смс`,
    announce: `Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    categories: [1, 3, 5],
  };

  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/5`).send(newArticle);
  });

  test(`Статус код 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Публикация была изменена`, () =>
    request(app)
      .get(`/articles/5`)
      .expect((res) =>
        expect(res.body.title).toBe(
            `Как собрать камни бесконечности без регистрации и смс`
        )
      ));
});

test(`API возвращает код ответа 404 во время попытки изменить не существующую публикацию`, async () => {
  const app = await createAPI();

  const validArticle = {
    userId: 1,
    title: `Что такое золотое сечение и прочее`,
    fullText: `Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Программировать не настолько сложно, как об этом говорят. Рок-музыка всегда ассоциировалась с протестами.`,
    categories: [1, 3, 5],
  };

  return request(app)
    .put(`/articles/1337`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API возвращает код ответа 400 во время попытки изменить публикацию не валидными данными`, async () => {
  const app = await createAPI();

  const invalidArticle = {
    title: `Что такое золотое сечение`,
  };

  return request(app)
    .put(`/articles/gFNhOS`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API корректно удаляет публикацию по id`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/5`);
  });

  test(`Статус код 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Количество публикаций стало 4`, () =>
    request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API возвращает 404 на попытку удалить не существующую публикацию`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/20`).expect(HttpCode.NOT_FOUND);
});

test(`API возвращает 404 на попытку создать новый комментарий к не существующей публикации`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1337/comments`)
    .send({
      text: `Неважно`,
      userId: 1,
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API не позволяет удалить комментарий к не существующей публикации`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/1337/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API не позволяет удалить не существующий комментарий`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/1/comments/2337`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API возвращает список комментариев к публикации`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/articles/2/comments`);
  });

  test(`Статус код 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Возвращает список из 4 комментариев`, () =>
    expect(response.body.length).toBe(4));

  test(`id первого комментария "Давно не пользуюсь стационарными компьютерами. Ноутбуки победили."`, () =>
    expect(response.body[0].text).toBe(
        `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
    ));
});

describe(`API создаёт комментарий если данные валидны`, () => {
  const newComment = {
    userId: 1,
    text: `Валидному комментарию достаточно этого поля`,
  };
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/1/comments`).send(newComment);
  });

  test(`Статус код 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Количество комментариев изменено`, () =>
    request(app)
      .get(`/articles/1/comments`)
      .expect((res) => expect(res.body.length).toBe(2)));
});

test(`API возвращает код статуса 400 при попытке создать не валидный комментарий`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/articles/1/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API корректно удаляет комментарий`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/1/comments/1`);
  });

  test(`Статус код 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Количество комментариев стало 0`, () =>
    request(app)
      .get(`/articles/1/comments`)
      .expect((res) => expect(res.body.length).toBe(0)));
});

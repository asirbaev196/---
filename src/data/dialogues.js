export const dialogues = {
  mother_call_intro: {
    speaker: 'Мама',
    text: 'Сынок? Ты чего не берёшь? Я волнуюсь.',
    choices: [
      {
        text: 'Прости, проспал. Всё хорошо.',
        trust: +10,
        next: 'mother_calm'
      },
      {
        text: 'Мам, я в порядке. Перезвоню.',
        trust: +5,
        next: 'mother_ok'
      },
      {
        text: 'Не звони мне больше.',
        trust: -20,
        next: 'mother_cry'
      }
    ]
  },
  mother_calm: {
    speaker: 'Мама',
    text: 'Будь осторожен. Мне сон плохой снился. Чёрный фургон какой-то.',
    choices: [
      {
        text: 'Мама, это просто сон.',
        next: 'mother_end'
      }
    ]
  },
  mother_ok: {
    speaker: 'Мама',
    text: 'Ладно. Только не пропадай.',
    choices: [
      { text: 'Хорошо.', next: 'mother_end' }
    ]
  },
  mother_cry: {
    speaker: 'Мама',
    text: '...',
    choices: [
      { text: '...', next: 'mother_end' }
    ]
  },
  mother_end: {
    speaker: '',
    text: '',
    choices: [
      { text: 'Закончить звонок', end: true }
    ]
  }
};

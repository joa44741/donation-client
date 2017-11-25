export default class Fixtures {

  methods = ['Cash', 'PayPal'];

  candidates = [
    {
      firstName: 'Lisa',
      lastName: 'Simpson'
    },
    {
      firstName: 'Bart',
      lastName: 'Simpson'
    }
  ];

  donations = [
    {
      amount: 23,
      method: 'Cash',
      candidate: this.candidates[0]
    },
    {
      amount: 212,
      method: 'PayPal',
      candidate: this.candidates[1]
    }
  ];

  users = {
    'homer@simpson.com': {
      firstName: 'Homer',
      lastName: 'Simpson',
      email: 'homer@simpson.com',
      password: 'secret'
    },
    'marge@simpson.com': {
      firstName: 'Marge',
      lastName: 'Simpson',
      email: 'marge@simpson.com',
      password: 'secret'
    }
  }
}

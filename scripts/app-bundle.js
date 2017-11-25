define('app',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './services/messages'], function (exports, _aureliaFramework, _aureliaEventAggregator, _messages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function App(au, ea) {
      var _this = this;

      _classCallCheck(this, App);

      ea.subscribe(_messages.LoginStatus, function (msg) {
        if (msg.status.success === true) {
          au.setRoot('home').then(function () {
            _this.router.navigateToRoute('donate');
          });
        } else {
          au.setRoot('app').then(function () {
            _this.router.navigateToRoute('login');
          });
        }
      });
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: ['', 'login'], name: 'login', moduleId: 'viewmodels/login/login', nav: true, title: 'Login' }, { route: 'signup', name: 'signup', moduleId: 'viewmodels/signup/signup', nav: true, title: 'Signup' }]);
      this.router = router;
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/donation-service',['exports', 'aurelia-framework', './fixtures', './messages', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _fixtures, _messages, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _fixtures2 = _interopRequireDefault(_fixtures);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var DonationService = (_dec = (0, _aureliaFramework.inject)(_fixtures2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function DonationService(data, ea) {
      _classCallCheck(this, DonationService);

      this.donations = [];
      this.methods = [];
      this.candidates = [];
      this.users = [];
      this.total = 0;

      this.users = data.users;
      this.donations = data.donations;
      this.candidates = data.candidates;
      this.methods = data.methods;
      this.ea = ea;
    }

    DonationService.prototype.donate = function donate(amount, method, candidate) {
      var donation = {
        amount: amount,
        method: method,
        candidate: candidate
      };
      this.donations.push(donation);
      console.log(amount + ' donated to ' + candidate.firstName + ' ' + candidate.lastName + ': ' + method);

      this.total = this.total + parseInt(amount, 10);
      console.log('Total so far ' + this.total);
      this.ea.publish(new _messages.TotalUpdate(this.total));
    };

    DonationService.prototype.addCandidate = function addCandidate(firstName, lastName, office) {
      var candidate = {
        firstName: firstName,
        lastName: lastName,
        office: office
      };
      this.candidates.push(candidate);
    };

    DonationService.prototype.register = function register(firstName, lastName, email, password) {
      var newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      };
      this.users[email] = newUser;
    };

    DonationService.prototype.login = function login(email, password) {
      var status = {
        success: false,
        message: ''
      };

      if (this.users[email]) {
        if (this.users[email].password === password) {
          status.success = true;
          status.message = 'logged in';
        } else {
          status.message = 'Incorrect password';
        }
      } else {
        status.message = 'Unknown user';
      }
      this.ea.publish(new _messages.LoginStatus(status));
    };

    DonationService.prototype.logout = function logout() {
      var status = {
        success: false,
        message: ''
      };
      this.ea.publish(new _messages.LoginStatus(status));
    };

    return DonationService;
  }()) || _class);
  exports.default = DonationService;
});
define('services/fixtures',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Fixtures = function Fixtures() {
    _classCallCheck(this, Fixtures);

    this.methods = ['Cash', 'PayPal'];
    this.candidates = [{
      firstName: 'Lisa',
      lastName: 'Simpson'
    }, {
      firstName: 'Bart',
      lastName: 'Simpson'
    }];
    this.donations = [{
      amount: 23,
      method: 'Cash',
      candidate: this.candidates[0]
    }, {
      amount: 212,
      method: 'PayPal',
      candidate: this.candidates[1]
    }];
    this.users = {
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
    };
  };

  exports.default = Fixtures;
});
define('services/messages',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var TotalUpdate = exports.TotalUpdate = function TotalUpdate(total) {
    _classCallCheck(this, TotalUpdate);

    this.total = total;
  };

  var LoginStatus = exports.LoginStatus = function LoginStatus(status) {
    _classCallCheck(this, LoginStatus);

    this.status = status;
  };
});
define('viewmodels/candidates/candidates',['exports', 'aurelia-framework', '../../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Candidate = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Candidate = exports.Candidate = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Candidate(ds) {
      _classCallCheck(this, Candidate);

      this.firstName = '';
      this.lastName = '';
      this.office = '';

      this.donationService = ds;
    }

    Candidate.prototype.addCandidate = function addCandidate() {
      this.donationService.addCandidate(this.firstName, this.lastName, this.office);
      this.initFields();
    };

    Candidate.prototype.initFields = function initFields() {
      this.firstName = '';
      this.lastName = '';
      this.office = '';
    };

    return Candidate;
  }()) || _class);
});
define('viewmodels/donate/donate',['exports', 'aurelia-framework', '../../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Donate = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Donate = exports.Donate = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Donate(ds) {
      _classCallCheck(this, Donate);

      this.amount = 0;
      this.methods = [];
      this.selectedMethod = '';
      this.candidates = [];
      this.selectedCandidate = '';

      this.donationService = ds;
      this.methods = ds.methods;
      this.selectedMethod = this.methods[0];
      this.candidates = ds.candidates;
      this.selectedCandidate = this.candidates[0];
    }

    Donate.prototype.makeDonation = function makeDonation() {
      this.donationService.donate(this.amount, this.selectedMethod, this.selectedCandidate);
    };

    return Donate;
  }()) || _class);
});
define('viewmodels/report/report',['exports', 'aurelia-framework', '../../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Report = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Report = exports.Report = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function Report(ds) {
    _classCallCheck(this, Report);

    this.donations = [];

    this.donationService = ds;
    this.donations = this.donationService.donations;
  }) || _class);
});
define('viewmodels/stats/stats',['exports', 'aurelia-framework', '../../services/messages', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _messages, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Stats = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Stats = exports.Stats = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function Stats(ea) {
    var _this = this;

    _classCallCheck(this, Stats);

    this.total = 0;

    ea.subscribe(_messages.TotalUpdate, function (msg) {
      _this.total = msg.total;
    });
  }) || _class);
});
define('viewmodels/login/login',['exports', 'aurelia-framework', '../../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Login(ds) {
      _classCallCheck(this, Login);

      this.email = 'marge@simpson.com';
      this.password = 'secret';

      this.donationService = ds;
      this.prompt = '';
    }

    Login.prototype.login = function login(e) {
      console.log('Trying to log in ' + this.email);
      this.donationService.login(this.email, this.password);
    };

    return Login;
  }()) || _class);
});
define('viewmodels/signup/signup',['exports', 'aurelia-framework', '../../services/donation-service'], function (exports, _aureliaFramework, _donationService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Signup = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Signup(ds) {
      _classCallCheck(this, Signup);

      this.firstName = 'Marge';
      this.lastName = 'Simpson';
      this.email = 'marge@simpson.com';
      this.password = 'secret';

      this.donationService = ds;
    }

    Signup.prototype.register = function register(e) {
      this.showSignup = false;
      this.donationService.register(this.firstName, this.lastName, this.email, this.password);
      this.donationService.login(this.email, this.password);
    };

    return Signup;
  }()) || _class);
});
define('home',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Home = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia), _dec(_class = function () {
    function Home(au) {
      _classCallCheck(this, Home);

      this.aurelia = au;
    }

    Home.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: ['', 'home'], name: 'donate', moduleId: 'viewmodels/donate/donate', nav: true, title: 'Donate' }, { route: 'report', name: 'report', moduleId: 'viewmodels/report/report', nav: true, title: 'Report' }, { route: 'candidates', name: 'candidates', moduleId: 'viewmodels/candidates/candidates', nav: true, title: 'Candidates' }, { route: 'stats', name: 'stats', moduleId: 'viewmodels/stats/stats', nav: true, title: 'Stats' }, { route: 'logout', name: 'logout', moduleId: 'viewmodels/logout/logout', nav: true, title: 'Logout' }]);
      this.router = router;
    };

    return Home;
  }()) || _class);
});
define('viewmodels/logout/logout',['exports', '../../services/donation-service', 'aurelia-framework'], function (exports, _donationService, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Logout = undefined;

  var _donationService2 = _interopRequireDefault(_donationService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_donationService2.default), _dec(_class = function () {
    function Logout(donationService) {
      _classCallCheck(this, Logout);

      this.donationService = donationService;
    }

    Logout.prototype.logout = function logout() {
      console.log('logging out');
      this.donationService.logout();
    };

    return Logout;
  }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"nav-bar.html\"></require><div class=\"ui container page-host\"><nav-bar router.bind=\"router\"></nav-bar><router-view></router-view></div></template>"; });
define('text!viewmodels/candidates/candidates.html', ['module'], function(module) { module.exports = "<template><form submit.trigger=\"addCandidate()\" class=\"ui form stacked segment\"><h3 class=\"ui dividing header\">Add a Candidate</h3><div class=\"field\"><label>First Name</label><input value.bind=\"firstName\"></div><div class=\"field\"><label>Last Name</label><input value.bind=\"lastName\"></div><div class=\"field\"><label>Office</label><input value.bind=\"office\"></div><button class=\"ui blue submit button\">Add</button></form></template>"; });
define('text!viewmodels/donate/donate.html', ['module'], function(module) { module.exports = "<template><form submit.trigger=\"makeDonation()\" class=\"ui form stacked segment\"><h3 class=\"ui dividing header\">Make a Donation</h3><div class=\"grouped inline fields\"><div class=\"field\"><label>Amount</label><input type=\"number\" value.bind=\"amount\"></div></div><h4 class=\"ui dividing header\">Select Method</h4><div class=\"grouped inline fields\"><div class=\"field\" repeat.for=\"method of methods\"><div class=\"ui radio checkbox\"><input type=\"radio\" model.bind=\"method\" checked.bind=\"selectedMethod\"><label>${method}</label></div></div><label class=\"ui circular label\"> ${selectedMethod} </label></div><h4 class=\"ui dividing header\">Select Candidate</h4><div class=\"grouped inline fields\"><div class=\"field\" repeat.for=\"candidate of candidates\"><div class=\"ui radio checkbox\"><input type=\"radio\" model.bind=\"candidate\" checked.bind=\"selectedCandidate\"><label>${candidate.lastName}, ${candidate.firstName}</label></div></div><label class=\"ui circular label\"> ${selectedCandidate.firstName} ${selectedCandidate.lastName}</label></div><button class=\"ui blue submit button\">Donate</button></form></template>"; });
define('text!viewmodels/login/login.html', ['module'], function(module) { module.exports = "<template><form submit.delegate=\"login($event)\" class=\"ui stacked segment form\"><h3 class=\"ui header\">Log-in</h3><div class=\"field\"><label>Email</label><input placeholder=\"Email\" value.bind=\"email\"></div><div class=\"field\"><label>Password</label><input type=\"password\" value.bind=\"password\"></div><button class=\"ui blue submit button\">Login</button><h3>${prompt}</h3></form></template>"; });
define('text!viewmodels/report/report.html', ['module'], function(module) { module.exports = "<template><article class=\"ui stacked segment\"><h3 class=\"ui dividing header\">Donations to Date</h3><table class=\"ui celled table segment\"><thead><tr><th>Amount</th><th>Method donated</th><th>Candidate</th></tr></thead><tbody><tr repeat.for=\"donation of donations\"><td> ${donation.amount}</td><td> ${donation.method}</td><td> ${donation.candidate.lastName}, ${donation.candidate.firstName}</td></tr></tbody></table></article></template>"; });
define('text!viewmodels/signup/signup.html', ['module'], function(module) { module.exports = "<template><form submit.delegate=\"register($event)\" class=\"ui stacked segment form\"><h3 class=\"ui header\">Register</h3><div class=\"two fields\"><div class=\"field\"><label>First Name</label><input placeholder=\"First Name\" type=\"text\" value.bind=\"firstName\"></div><div class=\"field\"><label>Last Name</label><input placeholder=\"Last Name\" type=\"text\" value.bind=\"lastName\"></div></div><div class=\"field\"><label>Email</label><input placeholder=\"Email\" type=\"text\" value.bind=\"email\"></div><div class=\"field\"><label>Password</label><input type=\"password\" value.bind=\"password\"></div><button class=\"ui blue submit button\">Submit</button></form></template>"; });
define('text!viewmodels/stats/stats.html', ['module'], function(module) { module.exports = "<template><section class=\"ui stacked statistic segment\"><div class=\"value\"> ${total} </div><div class=\"label\">Donated</div></section></template>"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\"><nav class=\"ui inverted menu\"><header class=\"header item\"><a href=\"/\">Donation</a></header><div class=\"right menu\"><div repeat.for=\"row of router.navigation\"><a class=\"${row.isActive ? 'active' : ''} item\" href.bind=\"row.href\">${row.title}</a></div></div></nav></template>"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template><require from=\"nav-bar.html\"></require><div class=\"ui container page-host\"><nav-bar router.bind=\"router\"></nav-bar><router-view></router-view></div></template>"; });
define('text!viewmodels/logout/logout.html', ['module'], function(module) { module.exports = "<template><form submit.delegate=\"logout($event)\" class=\"ui stacked segment form\"><h3 class=\"ui header\">Are you sure you want to log out?</h3><button class=\"ui blue submit button\">Logout</button></form></template>"; });
//# sourceMappingURL=app-bundle.js.map
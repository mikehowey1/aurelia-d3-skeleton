export class App {
  configureRouter(config, router){
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'static-line-chart'], name: 'static-line-chart', moduleId: 'features/static-line-chart/static-line-chart', nav: true, title: 'Static Line Chart' }
    ]);

    this.router = router;
  }
}

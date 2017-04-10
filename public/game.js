planck.testbed('Car', function(testbed) {

  testbed.speed = 1.3;
  testbed.hz = 1 / 50;

  testbed.height = 60;
  testbed.width = 80;

  var pl = planck, Vec2 = pl.Vec2;
  var world = new pl.World({
    gravity : Vec2(0, -10)
  });

  // wheel spring settings
  var HZ = 4.0;
  var ZETA = 0.7;
  var SPEED = 50.0;

  var ground = world.createBody();

  var groundFD = {
    density : 0.0,
    friction : 0.6
  };

  var ADDITIONAL_HEIGHT = 35;

  // hill
  {
    var ground = world.createBody();

    var x1 = -20.0;
    var y1 = Math.pow(4/5, x1);
    for (var i = 1; i < 60; ++i) {
      var x2 = x1 + 0.5;
      var y2 = Math.pow(4/5, x1);

      var shape = pl.Edge(Vec2(x1, y1), Vec2(x2, y2));
      ground.createFixture(shape, 0.0);

      x1 = x2;
      y1 = y2;
    }
  }

  // Car
  var car = world.createDynamicBody(Vec2(-14.0, 1.0 + ADDITIONAL_HEIGHT));
  car.createFixture(pl.Polygon([
    Vec2(-1.5, -0.5),
    Vec2(1.5, -0.5),
    Vec2(1.5, 0.0),
    Vec2(0.0, 0.9),
    Vec2(-1.15, 0.9),
    Vec2(-1.5, 0.2)
  ]), 1.0);

  var wheelFD = {};
  wheelFD.density = 1.0;
  wheelFD.friction = 0.9;

  var wheelBack = world.createDynamicBody(Vec2(-15, 0.35 + ADDITIONAL_HEIGHT));
  wheelBack.createFixture(pl.Circle(0.4), wheelFD);

  var wheelFront = world.createDynamicBody(Vec2(-13.0, 0.4 + ADDITIONAL_HEIGHT));
  wheelFront.createFixture(pl.Circle(0.4), wheelFD);

  var springBack = world.createJoint(pl.WheelJoint({
    motorSpeed : 0.0,
    maxMotorTorque : 20.0,
    enableMotor : true,
    frequencyHz : HZ,
    dampingRatio : ZETA
  }, car, wheelBack, wheelBack.getPosition(), Vec2(0.0, 1.0)));

  var springFront = world.createJoint(pl.WheelJoint({
    motorSpeed : 0.0,
    maxMotorTorque : 10.0,
    enableMotor : false,
    frequencyHz : HZ,
    dampingRatio : ZETA
  }, car, wheelFront, wheelFront.getPosition(), Vec2(0.0, 1.0)));

  testbed.keydown = function() {
    if (testbed.activeKeys.down) {
      HZ = Math.max(0.0, HZ - 1.0);
      springBack.setSpringFrequencyHz(HZ);
      springFront.setSpringFrequencyHz(HZ);

    } else if (testbed.activeKeys.up) {
      HZ += 1.0;
      springBack.setSpringFrequencyHz(HZ);
      springFront.setSpringFrequencyHz(HZ);
    }
  };

  testbed.step = function() {
    // testbed.drawPolygon(points, 'red');
    if (testbed.activeKeys.right && testbed.activeKeys.left) {
      springBack.setMotorSpeed(0);
      springBack.enableMotor(true);

    } else if (testbed.activeKeys.right) {
      springBack.setMotorSpeed(-SPEED);
      springBack.enableMotor(true);

    } else if (testbed.activeKeys.left) {
      springBack.setMotorSpeed(+SPEED);
      springBack.enableMotor(true);

    } else {
      springBack.setMotorSpeed(0);
      springBack.enableMotor(false);
    }

    var cp = car.getPosition();

    if (cp.x > testbed.x + 10) {
      testbed.x = cp.x - 10;

    } else if (cp.x < testbed.x - 10) {
      testbed.x = cp.x + 10;
    }
  };

  return world;
});
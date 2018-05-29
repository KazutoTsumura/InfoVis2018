function main()
{
  //var volume = new KVS.SingleCubeData();
  //var volume = new KVS.CreateHydrogenData( 64, 64, 64 );
  var volume = new KVS.LobsterData();
  var screen = new KVS.THREEScreen();

  screen.init(volume, {
    width: window.innerWidth * 0.8,
    height: window.innerHeight,
    targetDom: document.getElementById('display'),
    enableAutoResize: false
  });
  setup();
  screen.loop();

  function setup()
  {
    var color = new KVS.Vec3( 0, 0, 0 );
    var box = new KVS.BoundingBox();
    box.setColor( color );
    box.setWidth( 2 );

    var smin = volume.min_value;
    var smax = volume.max_value;
    var isovalue = KVS.Mix( smin, smax, 0.5 );
    var isosurface = new KVS.Isosurface();
    isosurface.setIsovalue( isovalue );

    var mat_color = KVS.Mix( smin, smax, 0.5 );     //ザリガニの色

    document.getElementById('label_iso').innerHTML = "Isovalue: " + Math.round( isovalue ) + "\n";
    document.getElementById('label_col').innerHTML = "Color: " + Math.round( mat_color )+ "\n";

    var line = KVS.ToTHREELine( box.exec( volume ) );
    screen.scene.add( line );

    var surfaces = Isosurfaces( volume, isovalue, mat_color );
    screen.scene.add( surfaces );

    //isovalueに関するスライダー
    document.getElementById('isovalue')
    .addEventListener('mousemove', function() {
      var value = +document.getElementById('isovalue').value;
      var isovalue = KVS.Mix( smin, smax, value );
      document.getElementById('label_iso').innerHTML = "Isovalue: " + Math.round( isovalue ) + "\n";
    });
    ///////////////////////////

    //colorに関するスライダー
    document.getElementById('color')
    .addEventListener('mousemove', function() {
      var value = +document.getElementById('color').value;
      var mat_color = KVS.Mix( smin, smax, value );
      document.getElementById('label_col').innerHTML = "Color: " + Math.round( mat_color ) + "\n";
    });
    ///////////////////////////

    document.getElementById('change-status-button')
    .addEventListener('click', function() {
      screen.scene.remove( surfaces );
      ///isovalue///
      var value = +document.getElementById('isovalue').value;
      var isovalue = KVS.Mix( smin, smax, value );
      var isosurface = new KVS.Isosurface();
      isosurface.setIsovalue( isovalue );
      //////////////

      ///color///
      //value = +document.getElementById('color').value;
      //var mat_color = KVS.Mix( smin, smax, value );
      ///////////
      surfaces = Isosurfaces( volume, isovalue, mat_color );
      screen.scene.add( surfaces );
    });

    document.addEventListener( 'mousemove', function() {
      screen.light.position.copy( screen.camera.position );
    });

    window.addEventListener('resize', function() {
      screen.resize([
        window.innerWidth * 0.8,
        window.innerHeight
      ]);
    });

    screen.draw();
  }
}


function changeIsovalue() {

}

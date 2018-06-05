function main()
{
  //var volume = new KVS.SingleCubeData();
  //var volume = new KVS.CreateHydrogenData( 64, 64, 64 );
  var volume = new KVS.LobsterData();
  var screen = new KVS.THREEScreen();

  //カラーマップの作成
  var cmap = [];
  for ( var i = 0; i < 256; i++ )
  {
      var S = i / 255.0; // [0,1]
      var R = Math.max( Math.cos( (S - 1.0) * Math.PI ), 0.0 );
      var G = Math.max( Math.cos( (S - 0.5) * Math.PI ), 0.0 );
      var B = Math.max( Math.cos( S * Math.PI ), 0.0 );
      var color = new THREE.Color( R, G, B );
      cmap.push( [ S, '0x' + color.getHexString() ] );
  }
  //////////////////////

  /*
  // Draw color map
  var lut = new THREE.Lut( 'rainbow', cmap.length );
  lut.addColorMap( 'mycolormap', cmap );
  lut.changeColorMap( 'mycolormap' );
  scene.add( lut.setLegendOn( {
      'layout':'horizontal',
      'position': { 'x': 0.6, 'y': -1.1, 'z': 2 },
      'dimensions': { 'width': 0.15, 'height': 1.2 }
  } ) );*/

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

    var mat_color = KVS.Mix( smin, smax, 0.5 );     //ザリガニの色

    document.getElementById('label_iso').innerHTML = "Isovalue: " + Math.round( isovalue ) + "\n";
    document.getElementById('label_col').innerHTML = "Color: " + Math.round( mat_color )+ "\n";

    var line = KVS.ToTHREELine( box.exec( volume ) );
    screen.scene.add( line );

    var surfaces = Isosurfaces( volume, isovalue, mat_color, cmap );
    screen.scene.add( surfaces );

    /** isovalueに関するスライダーの値 **/
    document.getElementById('isovalue')
    .addEventListener('mousemove', function() {
      var value = +document.getElementById('isovalue').value;
      var isovalue = KVS.Mix( smin, smax, value );
      document.getElementById('label_iso').innerHTML = "Isovalue: " + Math.round( isovalue ) + "\n";
    });
    /********************************/

    /** colorに関するスライダーの値    **/
    document.getElementById('color')
    .addEventListener('mousemove', function() {
      var c_value = +document.getElementById('color').value;
      var mat_color = KVS.Mix( smin, smax, c_value );
      document.getElementById('label_col').innerHTML = "Color: " + Math.round( mat_color ) + "\n";
    });
    /********************************/


    /***** Applyの適用 *****/
    document.getElementById('change-status-button')
    .addEventListener('click', function() {
      screen.scene.remove( surfaces );
      ///isovalue///
      var value = +document.getElementById('isovalue').value;
      var isovalue = KVS.Mix( smin, smax, value );
      //////////////

      ///color///
      c_value = +document.getElementById('color').value;
      var mat_color = KVS.Mix( smin, smax, c_value );
      ///////////

      /**varying vec3 point_color;
  	  varying vec4 point_position;
  	  varying vec3 normal_vector;
  	  uniform vec3 light_position;

      var element_Lamb = document.getElementById("Lambertian");
      var element_Phon = document.getElementById("Phong");

      point_position = modelViewMatrix * vec4( position, 1.0 );
        normal_vector = normalMatrix * normal;
	    vec3 C = color;
	    vec3 L = normalize( light_position - point_position.xyz ); vec3 N = normalize( normal_vector );
      if(element_Lamb.checked)  point_color = LambertianReflection( C, L, N );
      if(element_Phon.checked)  point_color = PhongReflection( C, L, N );
	    gl_Position = projectionMatrix * point_position;

      gl_FragColor = vec4( point_color, 1.0 );*/

      surfaces = Isosurfaces( volume, isovalue, mat_color, cmap);
      screen.scene.add( surfaces );
    });
    /**********************/

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


/*vec3 LambertianReflection( vec3 C, vec3 L, vec3 N )
 {
    float ka = 0.4;
    float kd = 0.6;

    float dd = max(dot(N, L), 0.0);
    float Ia = ka;
    float Id = kd * dd;
    return C * (Ia + Id);
 }

 vec3 PhongReflection( vec3 C, vec3 L, vec3 N )
  {
     float ka = 0.3;
     float kd = 0.5;
     float ks = 0.8;
     float n = 50.0;
     vec3 R = reflect( -L, N );
     vec3 V = normalize( camera_position - point_position.xyz );

     float dd = max( dot( N, L ), 0.0 );
     float ds = pow( max( dot( R, V ), 0.0 ), n );
     if ( dd <= 0.0 ) { ds = 0.0; }
     float Ia = ka;
     float Id = kd * dd;
     float Is = ks * ds;
     return C * ( Ia + Id + Is );
  }*/

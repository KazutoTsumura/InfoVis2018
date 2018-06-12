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
    // Draw color map
    /*var lut = new THREE.Lut( 'rainbow', cmap.length );
    lut.addColorMap( 'mycolormap', cmap );
    lut.changeColorMap( 'mycolormap' );
    scene.add( lut.setLegendOn( {
        'layout':'horizontal',
        'position': { 'x': 0.6, 'y': -1.1, 'z': 2 },
        'dimensions': { 'width': 0.15, 'height': 1.2 }
    } ) );*/
    var sw_shader = 0;    //0:gouraud     1:phong
    var sw_ref = 0;       //0:Lambertian  1:Phong

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
        var isovalue = KVS.Mix( smin, smax, 0.5 );      //閾値

        var mat_color = KVS.Mix( smin, smax, 0.5 );     //ザリガニの色



        document.getElementById('label_iso').innerHTML = "Isovalue: " + Math.round( isovalue ) + "\n";
        document.getElementById('label_col').innerHTML = "Color: " + Math.round( mat_color )+ "\n";

        var line = KVS.ToTHREELine( box.exec( volume ) );
        screen.scene.add( line );

        var surfaces = Isosurfaces( volume, isovalue, mat_color, cmap, sw_shader, sw_ref );
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
        var element_Lamb = document.getElementById("Lambertian");

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

            /*** shaderとrefrectionの設定 ***/
            //shaderの選択
            var radios = document.getElementsByName("shader");

            var result;
            for(var i=0; i<radios.length; i++){
                if (radios[i].checked) {
                    //選択されたラジオボタンのvalue値を取得する
                    result = radios[i].value;
                    break;
                }
            }

            if(result=="gouraud"){
                sw_shader = 0;
            }else if (result == "phong") {
                sw_shader = 1;
            }



            //reflectionの選択
            radios = document.getElementsByName("reflection");

            //var result;
            for(var i=0; i<radios.length; i++){
                if (radios[i].checked) {
                    //選択されたラジオボタンのvalue値を取得する
                    result = radios[i].value;
                    break;
                }
            }
            if(result=="Lambertian"){
                sw_ref = 0;
            }else if (result == "Phong") {
                sw_ref = 1;
            }

            /*******************************/


            surfaces = Isosurfaces( volume, isovalue, mat_color, cmap, sw_shader, sw_ref);
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

function hexagon(lng,lat,L){
    var polygon = new BMap.Polygon([
    new BMap.Point(lng-0.0117*L,lat),
    new BMap.Point(lng-0.0117*L/2,lat+0.009*L*Math.sqrt(3)/2),
    new BMap.Point(lng+0.0117*L/2,lat+0.009*L*Math.sqrt(3)/2),  
    new BMap.Point(lng+0.0117*L,lat),

    new BMap.Point(lng+0.0117*L/2,lat-0.009*L*Math.sqrt(3)/2),

    new BMap.Point(lng-0.0117*L/2,lat-0.009*L*Math.sqrt(3)/2),

    new BMap.Point(lng-0.0117*L,lat),
    ], {strokeColor:"red", strokeWeight:2, strokeOpacity:0.5});   //创建正六边形
    map.addOverlay(hexagon);
}
      


	var hexagon = hexagon(116.505, 39.995,5);
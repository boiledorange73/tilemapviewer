(function(global) {

  var map = null; // マップ
  var layers = []; // レイヤ (初期のOSMは除く)
  var lyrcnt = 0; // レイヤ数カウンタ (初期のOSMは除く)

  //
  // 初期化
  //
  function init() {
    // 後でレイヤスイッチャーを開くために
    // レイヤスイッチャーだけ生成
    // maxResolution 0 の upp = 90/256
    var layerswitcher = new OpenLayers.Control.LayerSwitcher();
    // マップオプション
    var options = {
      projection: new OpenLayers.Projection("EPSG:4326"),
      maxResolution: 0.70312500000000,
      maxExtent: new OpenLayers.Bounds(-180, -90, 180, 90),
      units: "dd",
      controls: [
          new OpenLayers.Control.PanZoomBar(),
          layerswitcher,
          new OpenLayers.Control.Navigation()
        ],
      numZoomLevels: 20,
      displayProjection: new OpenLayers.Projection("EPSG:4326")
    };
    map = new OpenLayers.Map("MAP",options);
    // OSMレイヤを追加
//    map.addLayer(new OpenLayers.Layer.OSM());
    map.addLayer(
      new OpenLayers.Layer.XYZ(
        "KBN25000ANF",
        "http://www.finds.jp/ws/tmc/1.0.0/KBN25000ANF-4326-L/${z}/${x}/${y}.png",
        {"isBaseLayer": true}
      )
    );

    // 位置、ズーム設定
    var lonlat = new OpenLayers.LonLat(139.7704, 35.68721);
    lonlat.transform(map.displayProjection,map.getProjectionObject());
    map.setCenter(lonlat, 14);
    // レイヤスイッチャーを開く
    layerswitcher.maximizeControl();

    // 入力部生成
    var form = document.getElementById("INPUT");
    // 説明書き
    var p_desc = document.createElement("p");
    form.appendChild(p_desc);
    p_desc.appendChild(document.createTextNode("<base>/${z}/${x}/${y}.<ext>"));
    // 入力ライン
    var p_box = document.createElement("p");
    form.appendChild(p_box);
    // 入力ライン/テキストボックス
    var textbox = document.createElement("input");
    textbox.type = "text";
    textbox.size = "40";
    p_box.appendChild(textbox);
    // 入力ライン/送信
    var btn_submit = document.createElement("input");
    btn_submit.type = "submit";
    btn_submit.value = "追加";
    p_box.appendChild(btn_submit);
    // 送信ボタンをクリックした時のハンドラ
    btn_submit.onclick = function() {
      addlayer(textbox.value, null, true);
    }
    // 入力ライン/クリア
    var btn_clear = document.createElement("INPUT");
    btn_clear.type = "reset";
    btn_clear.value = "消去";
    p_box.appendChild(btn_clear);
    // 入力ライン/全クリア
    var btn_removeone = document.createElement("button");
    btn_removeone.appendChild(document.createTextNode("レイヤ削除"));
    p_box.appendChild(btn_removeone);
    btn_removeone.onclick = function() {
      removeCurrentBaseLayer();
    }
  }

  //
  // 指定したとおりのXYZレイヤを作る
  // lyrcntをインクリメント
  // layersにpush
  //
  function addlayer(url, name, isbaselayer) {
    isbaselayer = !!isbaselayer;
    if( name == null ) {
      name = "MAP "+(lyrcnt+1);
    }
    var newlayer = new OpenLayers.Layer.XYZ(name, url, {"isBaseLayer": isbaselayer});
    map.addLayer(newlayer);
    if( isbaselayer ) {
      map.setBaseLayer(newlayer);
    }
    else {
      newlayer.setVisibility(true);
    }
    layers.push(newlayer);
    lyrcnt++;
  }

  //
  // 現在表示しているベースレイヤの消去
  // (addLayerで追加したもののみ)
  //
  function removeCurrentBaseLayer() {
    // 現在のベースレイヤを探索
    var currentBaseLayer = map.baseLayer;
    var ix;
    for(ix = 0; ix < layers.length && currentBaseLayer != layers[ix]; ix++ ) {
      // DOES NOTHING
    }
    if( ix < layers.length ) {
      // 発見した
      map.removeLayer(layers[ix]);
      // layersから削除
      layers.splice(ix, 1);
    }
  }

  global["window"].onload = init;


})((this || 0).self || global);

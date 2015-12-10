var officegen = require('officegen');
var fs = require('fs');
var $q = require('q');
var path = require('path');
var stat = fs.statSync;
require('./date');

var slide;
var pptx = officegen ({
    'type': 'pptx',
    'title': 'Weekly Report', 
    'onend': function ( written ) {
        console.log ( 'Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n' );
    },
    'onerr': function ( err ) {
        console.log ( err );
    }
});

function generateSlides(content, callback) {
  // do the rest things here
  console.log('finalize');

  // Let's create a new slide:
  slide = pptx.makeNewSlide();

  slide.name = '1st slide!';
  slide.addImage(path.resolve(__dirname, '../imgs/bg1.png'), { y: 0, x: 0, cx: '100%', cy: '100%'});  
  slide.addText ( '前端JS开发周报', { x: 25, y: 375, font_size: 44, cx: 1000, font_face: '微软雅黑', color: '707575', bold: true} );
  slide.addText ( '唐婧', { x: 25, y: 450, font_size: 24, cx: 1000, font_face: '微软雅黑', color: '707575', bold: true} );
  
  // 2nd slide:
  slide = pptx.makeNewSlide();
  slide.name = '2nd slide!';
  slide.addImage(path.resolve(__dirname, '../imgs/bg2.png'), { y: 0, x: 0, cx: '100%', cy: '100%'});  
  slide.addText ( '其他(P2 or P3)', { x: 30, y: 48, font_size: 40, cx: 1000, cy: 112, font_face: '微软雅黑', color: '91D04E', bold: true} );
  slide.addText ( content, { x: 30, y: 135, font_size: 20, cx: 1000, cy: 360, font_face: 'Calibri', color: '707575'} );

  // 3rd slide:
  /*slide = pptx.makeNewSlide();
  slide.name = '3rd slide!';
  slide.addImage(path.resolve(__dirname, '../imgs/bg2.png'), { y: 0, x: 0, cx: '100%', cy: '100%'});  
  slide.addText ( '其他(P2 or P3)', { x: 30, y: 48, font_size: 40, cx: 1000, cy: 112, font_face: '微软雅黑', color: '91D04E', bold: true} );
  slide.addText ( '\r\n本周春苗学习进度\n\t深入学习event', { x: 30, y: 135, font_size: 20, cx: 1000, cy: 360, font_face: 'Calibri', color: '707575'} );
  */

  // 4rd
  slide = pptx.makeNewSlide();

  slide.addImage(path.resolve(__dirname, '../imgs/bg3.png'), { y: 0, x: 0, cx: '100%', cy: '100%' }); 
  
  callback();
}


module.exports = {
    generate: function(content, callback){
        var deferred = $q.defer();
        generateSlides(content, function(){
            var _path = 'weekly_tj_'+new Date().Format('yyyyMMdd')+'.pptx';
            var out = fs.createWriteStream(_path); 
            pptx.generate ( out, {
                'finalize': function ( written ) {
                    deferred.resolve({
                        code:'A00000',
                        data:{
                            info:stat(_path),
                            path:_path
                        },
                        msg:'Finish to create a PowerPoint file.\nTotal bytes created: ' + written 
                    });
                },
                'error': function ( err ) {
                    deferred.reject({
                        code:'A00001',
                        error:err
                    });
                }
            });
        });
        return deferred.promise.nodeify(callback); 
    }
}
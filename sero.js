console.log('sero.js loaded');

sero={
    date:new Date()
}


if(typeof(define)!="undefined"){
    define(sero)
}
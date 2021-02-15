console.log('sero.js loaded');

sero={
    date:new Date(),
    update:100000,
    tracker:{},
    hub:{},
    cache:{}
}

sero.getScript =function(url){
    let s = document.createElement('script')
    s.src=url
    document.head.appendChild(s)
    return s
}

sero.get=async(url='https://iit-backend.com/data_provider/records')=>{
    let res =[]
    if(typeof(localforage)!="undefined"){
        let resDate = await localforage.getItem(`${url}_date`)
        if((Date.now()-resDate)<sero.update){
            sero.cache[url]=await localforage.getItem(url)
        }
    }
    if(sero.cache[url]){
        res=sero.cache[url]
    }else{
        res=await (await fetch(url)).json()
        sero.cache[url]=res
        if(typeof(localforage)!="undefined"){
            localforage.setItem(url,res)
            localforage.setItem(`${url}_date`,new Date())
        }
    }
    return res
}

sero.tracker.records=async(_)=>{
    return await sero.get('https://iit-backend.com/data_provider/records')
}

if(typeof(localforage)=="undefined"){
    sero.getScript('https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js')
}

if(typeof(define)!="undefined"){
    define(sero)
}
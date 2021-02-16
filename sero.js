console.log('sero.js loaded');

sero={
    date:new Date(),
    update:24*60*60*1000,
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

sero.get=async(url='https://iit-backend.com/data_provider/records',p={})=>{
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
        res=await (await fetch(url,p)).json()
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

sero.tracker.queryBy=async(group="country")=>{
    return await (await sero.get(`https://iit-backend.com/meta_analysis/records#${group}`, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,pt-PT;q=0.8,pt;q=0.7,fr;q=0.6",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site"
      },
      referrer: "https://serotracker.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body:JSON.stringify({
       "start_date": "2019-02-01T01:00:00-05:00",
       "end_date": "2021-02-02T16:03:57-05:00",
       "filters": {
          "source_type": [],
          "test_type": [],
          "country": [],
          "population_group": [],
          "sex": [],
          "age": [],
          "overall_risk_of_bias": [],
          "isotypes_reported": [],
          "specimen_type": [],
          "estimate_grade": []
       },
       "aggregation_variable": group,
       "meta_analysis_technique": "fixed",
       "meta_analysis_transformation": "double_arcsin_precise"
    }), 
      method: "POST",
      mode: "cors",
      credentials: "omit"
    }))
}

if(typeof(localforage)=="undefined"){
    sero.getScript('https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js')
}

if(typeof(define)!="undefined"){
    define(sero)
}
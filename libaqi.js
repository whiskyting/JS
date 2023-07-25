class AQI {
    static KEY = 'mykey1'
 
 
    constructor(elementId) {
        this.element = document.getElementById(elementId)
    }
 
 
    show(jsonObj) {
        const color = function(aqi) {
            aqi = parseInt(aqi)
            if (aqi < 50)   return 'green'
            if (aqi < 100)  return 'yellow'
            if (aqi < 150)  return 'orange'
            if (aqi < 200)  return 'red'
            if (aqi < 300)  return 'purple'
            if (aqi < 1000) return 'maroon'
        }
 
 
        jsonObj.records.sort(function(a, b) {
            return parseInt(a.aqi) - parseInt(b.aqi)
        })
 
 
        // document.getElementById('date_update').innerHTML = jsonObj.records[0].publishtime
        let s = `
            <div>${jsonObj.records[0].publishtime}</div>
            <div class="container">
        `
        jsonObj.records.forEach(function(item) {
            s += `
            <div id="site" class="site">
                <div id="head" style="text-align: center">
                    <h3>${item.county}${item.sitename}</h3>
                    <h2 style="color:${color(item.aqi)}">${item.aqi}</h2>
                </div>
                <div>
                    空氣品質：${item.status}
                </div>
            </div>
            `
        })
        this.element.innerHTML = s + '</div>'
    }
 
 
    getAQIFromURL(complete) {
        fetch('https://raw.githubusercontent.com/kirkchu/mongodb/main/aqiv2.json')
        .then(function(response) {
            return response.text()
        })
        .then(function(str) {
            localStorage.setItem(AQI.KEY, str)
            complete(JSON.parse(str))
        })
    }
 
 
    getAQIFromLocalStorage() {
        return new Promise(function(resolve, reject) {
            let data = localStorage.getItem(AQI.KEY)
            if (data == null) {
                reject('null data in localStorage')
            } else {
                resolve(JSON.parse(data))
            }
        })
    }
 
 
    reloadIfNeeded(jsonObj, threshold=80) {
        let d1 = new Date()
        let d2 = new Date(jsonObj.records[0].publishtime)
 
 
        let diff = (d1 - d2) / 60 / 1000
        console.log(diff)
       
        return diff > threshold
    }
 }
 
export default async function handler(req,res){

const contracts = []

// firebase load here

let total = 0
let family = 0

contracts.forEach(c=>{

total += Number(c.amount || 0)

family += Math.floor(
c.amount * 0.20
)

})

await fetch(
'https://discord.com/api/webhooks/1507275442657296386/utT-89112eXBwIL7ijrwlYz-ob4H9-bQh79PEbGR0XhWxuZpE7IShP8YSJCwkPyNVsnZ',
{
method:'POST',
headers:{
'Content-Type':'application/json'
},
body:JSON.stringify({

embeds:[{

title:'💸 WEEKLY CONTRACT REPORT',

color:0xff0055,

fields:[

{
name:'📄 Контрактів',
value:String(contracts.length),
inline:true
},

{
name:'💰 Загальний дохід',
value:`$${total.toLocaleString()}`,
inline:true
},

{
name:'🏦 GRIZZLY FAMILY',
value:`$${family.toLocaleString()}`,
inline:true
}

],

footer:{
text:'GRIZZLY FAMILY • WEEKLY REPORT'
},

timestamp:new Date()

}]

})
}
)

res.status(200).json({
success:true
})

}

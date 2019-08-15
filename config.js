export const config = {
    api_base_url:"https://www.rseecn.com:8089",
    
}

export const faultList = {
    errList: [
        {
            name: 'P0043',
            cn_desc: '热氧传感器加热器控制电路低 （第1排，传感器3',
            en_desc: 'HO2S Heater Control Circuit Low (Bank 1, Sensor 3)',
            background: '氧传感器的作用是测定发动机排气中的氧气含量，以修正喷油量，从而使发动机获得最佳空燃比。在OBD故障码中，你经常会看到第几排第几个氧传感器的说法。第1排是指气缸1所在的那个排，剩下的另外一排为第2排。不管哪一排，第1个传感器总是指上游氧传感器（催化箱之前），第2个传感器总是指下游氧传感器（催化箱之后）。电子控制单元（ECU）通过控制氧传感器加热器的开/关来保持氧传感器780oC的温度。如果加热器的控制电路电压低于校准的最低值，该故障码会出现。'
        },
    
        {
            name: 'P0092',
            cn_desc: '燃油压力调节器1控制电路高',
            en_desc: 'Fuel Pressure Regulator 1 Control Circuit High)',
        },
    
        {
            name: 'P1043',
            cn_desc: '喷油器3电源电压 - 短路',
            en_desc: 'Injector 3 Supply Voltage - Short Circuit',
        },
    
        {
            name: 'P2043',
            cn_desc: '还原剂温度传感器电路范围/性能',
            en_desc: 'Reductant Temperature Sensor Circuit Range/Performance',
        },
    
    ],

}



export const errList= [
    {name: "P0043", cn_desc: "热氧传感器加热器控制电路低 （第1排，传感器3", en_desc: "HO2S Heater Control Circuit Low (Bank 1, Sensor 3)", background: "氧传感器的作用是测定发动机排气中的氧气含量，以修正喷油量，从而使发动机获得最佳空燃比。在OBD故障码…的开/关来保持氧传感器780oC的温度。如果加热器的控制电路电压低于校准的最低值，该故障码会出现。"}
    ,{name: "P0092", cn_desc: "燃油压力调节器1控制电路高", en_desc: "Fuel Pressure Regulator 1 Control Circuit High)"}
    ,{name: "P1043", cn_desc: "喷油器3电源电压 - 短路", en_desc: "Injector 3 Supply Voltage - Short Circuit"}
    ,{name: "P2043", cn_desc: "还原剂温度传感器电路范围/性能", en_desc: "Reductant Temperature Sensor Circuit Range/Performance"}
    ,{name: "P3043", cn_desc: "暂无详细信息"}
    ,{name: "C0043", cn_desc: "暂无详细信息"}
    ,{name: "C0092", cn_desc: "暂无详细信息"}
    ,{name: "C1043", cn_desc: "暂无详细信息"}
    ,{name: "C2043", cn_desc: "暂无详细信息"}
    ,{name: "C3043", cn_desc: "暂无详细信息"}
    ,{name: "B0043", cn_desc: "暂无详细信息"}
    ,{name: "B0092", cn_desc: "暂无详细信息"}
    ,{name: "B1043", cn_desc: "暂无详细信息"}
    ,{name: "B2043", cn_desc: "暂无详细信息"}
    ,{name: "B3043", cn_desc: "暂无详细信息"}
    ,{name: "U0043", cn_desc: "暂无详细信息"}
    ,{name: "U0092", cn_desc: "暂无详细信息"}
    ,{name: "U1043", cn_desc: "暂无详细信息"}
    ,{name: "U2043", cn_desc: "暂无详细信息"}
    ,{name: "U3043", cn_desc: "暂无详细信息"}
    ]
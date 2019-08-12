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


    err: {
        "P0043"	:["热氧传感器加热器控制电路低 （第1排，传感器3）",	
        "HO2S Heater Control Circuit Low (Bank 1, Sensor 3)",	
        "氧传感器的作用是测定发动机排气中的氧气含量，以修正喷油量，从而使发动机获得最佳空燃比。在OBD故障码中，你经常会看到第几排第几个氧传感器的说法。第1排是指气缸1所在的那个排，剩下的另外一排为第2排。不管哪一排，第1个传感器总是指上游氧传感器（催化箱之前），第2个传感器总是指下游氧传感器（催化箱之后）。电子控制单元（ECU）通过控制氧传感器加热器的开/关来保持氧传感器780oC的温度。如果加热器的控制电路电压低于校准的最低值，该故障码会出现。",
        "0"	,"所有汽车制造商"
        ],

        "P0092"	:["燃油压力调节器1控制电路高",
            "Fuel Pressure Regulator 1 Control Circuit High",
            "燃油压力调节器利用一个弹簧推动的阀门，将多余汽油流回油箱，从而保持油路内的压力恒定。燃油压力调节器上有一根与进气歧管相连的真空管，以在不同的发动机运行状况下（根据真空度判断发动机负载）提供相应的汽油压力。大部分汽车的燃油压力调机器都位于燃油分供管上，但也有些汽车的燃油压力调节器位于油箱之内。如果电子控制单元（ECU）检测到燃油压力调节器1控制电路电压高于校准的最高值，该故障码会出现。",
            "0","所有汽车制造商"
        ],

        "P1043":["喷油器3电源电压 - 短路","Injector 3 Supply Voltage - Short Circuit",
        "喷油器的作用是将燃油雾化，使其适应燃烧的要求。工作原理是当电磁线圈通电时，产生吸力，针阀被吸起，打开喷孔，燃油经针阀头部的轴针与喷孔之间的环形间隙高速喷出，形成雾状。",
        "0","奥迪,大众"
        ],

        "P2043":["还原剂温度传感器电路范围/性能","Reductant Temperature Sensor Circuit Range/Performance",
            "柴油机排气液（DEF）也简称还原剂，是32.5%的尿素跟水的混合物。当喷射到排气中时，可以将氮氧化物转化为无害的氮气和水。还原剂加热器的作用是当外界温度很低时，保持还原剂为液体状态。当还原剂温度传感器检测到柴油机排气液（DEF）温度降到结冰温度时（-11摄氏度），动力总成控制模块（PCM）便会指令电热塞控制模块启动还原剂加热器。",
            "0"	,"所有汽车制造商"
        ],

        "P3043": [

        ],

        
        "C0092": [
            
        ],

    }
}



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

]
    
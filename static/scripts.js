window.Apex = {
  chart: {
    foreColor: '#ccc',
    toolbar: {
      show: false
    },
  },
  stroke: {
    width: 3
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    theme: 'dark'
  },
  grid: {
    borderColor: "#535A6C",
    xaxis: {
      lines: {
        show: true
      }
    }
  }
};

var spark1 = {
  chart: {
    id: 'spark1',
    group: 'sparks',
    type: 'line',
    height: 80,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 2,
      opacity: 0.2,
    }
  },
  series: [{
    data: [1, 2, 3, 4, 5, 6, 3, 2, 4, 10]
  }],
  stroke: {
    curve: 'smooth'
  },
  markers: {
    size: 0
  },
  grid: {
    padding: {
      top: 20,
      bottom: 10,
      left: 110
    }
  },
  colors: ['#fff'],
  tooltip: {
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function formatter(val) {
          return '';
        }
      }
    }
  }
}

var spark2 = {
  chart: {
    id: 'spark2',
    group: 'sparks',
    type: 'line',
    height: 80,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 2,
      opacity: 0.2,
    }
  },
  series: [{
    data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69, 12, 14, 2, 47, 32, 44, 14, 55, 41, 69]
  }],
  stroke: {
    curve: 'straight'
  },
  grid: {
    padding: {
      top: 20,
      bottom: 10,
      left: 110
    }
  },
  markers: {
    size: 0
  },
  colors: ['#fff'],
  tooltip: {
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function formatter(val) {
          return '';
        }
      }
    }
  }
}

var spark3 = {
  chart: {
    id: 'spark3',
    group: 'sparks',
    type: 'line',
    height: 80,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 2,
      opacity: 0.2,
    }
  },
  series: [{
    data: [47, 45, 74, 32, 56, 31, 44, 33, 45, 19]
  }],
  stroke: {
    curve: 'smooth'
  },
  markers: {
    size: 0
  },
  grid: {
    padding: {
      top: 20,
      bottom: 10,
      left: 110
    }
  },
  colors: ['#fff'],
  xaxis: {
    crosshairs: {
      width: 1
    },
  },
  tooltip: {
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function formatter(val) {
          return '';
        }
      }
    }
  }
}

var spark4 = {
  chart: {
    id: 'spark4',
    group: 'sparks',
    type: 'line',
    height: 80,
    sparkline: {
      enabled: true
    },
    dropShadow: {
      enabled: true,
      top: 1,
      left: 1,
      blur: 2,
      opacity: 0.2,
    }
  },
  series: [{
    data: [15, 75, 47, 65, 14, 32, 19, 54, 44, 61]
  }],
  stroke: {
    curve: 'smooth'
  },
  markers: {
    size: 0
  },
  grid: {
    padding: {
      top: 20,
      bottom: 10,
      left: 110
    }
  },
  colors: ['#fff'],
  xaxis: {
    crosshairs: {
      width: 1
    },
  },
  tooltip: {
    x: {
      show: false
    },
    y: {
      title: {
        formatter: function formatter(val) {
          return '';
        }
      }
    }
  }
}

var spark5 = {
  chart: {
    id: 'spark5',
    group: 'sparks',
    type: 'line',
    height: 50,
    sparkline: {
      enabled: true
    }
  },
  series: [{
    data: [0.1894714, 0.1894857, 0.1895, 0.1895429, 0.1895857, 0.1895857, 0.1895857, 0.1895714, 0.1895571, 0.1895429, 0.1895286, 0.1895, 0.1894143, 0.1893857, 0.1893571, 0.1893286, 0.1893, 0.1892857, 0.1892143, 0.1891857, 0.1891571, 0.1891286, 0.1891, 0.1890857]
  }],
  stroke: {
    curve: 'straight',
    width: 1
  },
  markers: {
    size: 0
  },
  colors: ['#fff'],
}

//new ApexCharts(document.querySelector("#spark1"), spark1).render();
new ApexCharts(document.querySelector("#spark2"), spark2).render();
new ApexCharts(document.querySelector("#spark3"), spark3).render();
new ApexCharts(document.querySelector("#spark4"), spark4).render();
new ApexCharts(document.querySelector("#spark5"), spark5).render();
new ApexCharts(document.querySelector("#spark6"), spark5).render();


var optionsLine = {
  chart: {
    height: 200,
    type: 'line',
    zoom: {
      enabled: false
    },
    dropShadow: {
      enabled: true,
      top: 3,
      left: 2,
      blur: 4,
      opacity: 1,
    }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  //colors: ["#3F51B5", '#2196F3'],
  series: [{
      name: "Music",
      data: [1, 15, 26, 20, 33, 27]
    },
    {
      name: "Photos",
      data: [3, 33, 21, 42, 19, 32]
    },
    {
      name: "Files",
      data: [0, 39, 52, 11, 29, 43]
    }
  ],
  title: {
    text: 'Media',
    align: 'left',
    offsetY: 25,
    offsetX: 20
  },
  subtitle: {
    text: 'Statistics',
    offsetY: 55,
    offsetX: 20
  },
  markers: {
    size: 6,
    strokeWidth: 0,
    hover: {
      size: 9
    }
  },
  grid: {
    show: true,
    padding: {
      bottom: 0
    }
  },
  labels: ['01/15/2002', '01/16/2002', '01/17/2002', '01/18/2002', '01/19/2002', '01/20/2002'],
  xaxis: {
    tooltip: {
      enabled: false
    }
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: -20
  }
}

var chartLine = new ApexCharts(document.querySelector('#line-adwords'), optionsLine);
chartLine.render();

var optionsCircle4 = {
  chart: {
    type: 'radialBar',
    height: 250,
    width: 200,
  },
  plotOptions: {
    radialBar: {
      size: undefined,
      inverseOrder: true,
      hollow: {
        margin: 5,
        size: '48%',
        background: 'transparent',

      },
      track: {
        show: false,
      },
      startAngle: -180,
      endAngle: 180

    },
  },
  stroke: {
    lineCap: 'round'
  },
  series: [71, 63, 77],
  labels: ['June', 'May', 'April'],
  legend: {
    show: true,
    floating: true,
    position: 'right',
    offsetX: 70,
    offsetY: 240
  },
}

var chartCircle4 = new ApexCharts(document.querySelector('#radialBarBottom'), optionsCircle4);
chartCircle4.render();


var optionsBar = {
  chart: {
    height: 200,
    type: 'bar',
    stacked: true,
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      horizontal: false,
    },
  },
  series: [{
    name: 'PRODUCT A',
    data: [14, 25, 21, 17, 12, 13, 11, 19]
  }, {
    name: 'PRODUCT B',
    data: [13, 23, 20, 8, 13, 27, 33, 12]
  }, {
    name: 'PRODUCT C',
    data: [11, 17, 15, 15, 21, 14, 15, 13]
  }],
  xaxis: {
    categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2', '2012 Q3', '2012 Q4'],
  },
  fill: {
    opacity: 1
  },

}

var chartBar = new ApexCharts(
  document.querySelector("#barchart"),
  optionsBar
);

chartBar.render();

var optionsArea = {
  chart: {
    height: 200,
    type: 'area',
    stacked: false,
  },
  stroke: {
    curve: 'straight'
  },
  series: [{
      name: "Music",
      data: [11, 15, 26, 20, 33, 27]
    },
    {
      name: "Photos",
      data: [32, 33, 21, 42, 19, 32]
    },
    {
      name: "Files",
      data: [20, 39, 52, 11, 29, 43]
    }
  ],
  xaxis: {
    categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2'],
  },
  tooltip: {
    followCursor: true
  },
  fill: {
    opacity: 1,
  },

}

var chartArea = new ApexCharts(
  document.querySelector("#areachart"),
  optionsArea
);

chartArea.render();


['0.18930000',
,'0.18930000',
,'0.18970000',
,'0.18970000',
,'0.18960000',
,'0.18960000',
,'0.18960000',
,'0.18960000',
,'0.18950000',
,'0.18950000',
,'0.18930000',
,'0.18880000',
,'0.18880000',
,'0.18880000',
,'0.18880000',
,'0.18880000',
,'0.18880000',
,'0.18840000',
,'0.18840000',
,'0.18840000',
,'0.18840000',
,'0.18840000',
,'0.18840000']
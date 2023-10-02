export interface ChartData {
  pieseries: number[];
  labels: string[];
  colors: string[];
  chart: {
    type: string;
    height: number;
  };
  legend: {
    show: boolean;
    position: string;
  };
  responsive: [
    {
      breakpoint: number;
      options: {
        chart: {
          width: number;
          height: number;
        };
        legend: {
          show: boolean;
          position: string;
        };
      };
    }
  ];
}

export interface GraphicData {
  porcentajes: number[];
  names: string[];
}

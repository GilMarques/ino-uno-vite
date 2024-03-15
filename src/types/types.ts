export type cardProps = {
    id: string;
    name: string;
}


export interface coordProps {
    x: number;
    y: number;
    angle: number;
  }

export interface handProps {
  id: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
}

export type ServerDataProps = {
  seat: number;
  cards: cardProps[] | null;
};





  



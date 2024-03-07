import { Component, OnInit } from '@angular/core';
import { PIECES } from '../../const/pieces';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent implements OnInit {
  BLOCK_SIZE = 20;
  BOARD_WIDHT = 14;
  BOARD_HEIGHT = 30;
  canvas!: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null | undefined;
  PLAYER_PIECE = {
    position: { x: 5, y: 5 },
    shape: PIECES

  }


  BOARD = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],    
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  ]

  ngOnInit(): void {
    this.initialization();
    this.boardSize();
    this.update();
  }

  initialization(): void {
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas?.getContext('2d');
    document.addEventListener('keydown', event => {
      this.movePiece(event);
    })
  }

  boardSize(): void {
    this.canvas!.width = this.BLOCK_SIZE * this.BOARD_WIDHT;
    this.canvas!.height = this.BLOCK_SIZE * this.BOARD_HEIGHT;

    this.context?.scale(this.BLOCK_SIZE, this.BLOCK_SIZE);
  }

  update(): void {
    window.requestAnimationFrame(()=>{
      this.draw();
     this.update();
    });
  }

  draw(): void {
    this.context!.fillStyle = '#000';
    this.context?.fillRect(0, 0, this.canvas!.width, this.canvas!.height);

    this.BOARD.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.context!.fillStyle = '#888';
          this.context?.fillRect(x, y, 1, 1);
        }
      })
    });

    this.PLAYER_PIECE.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          this.context!.fillStyle = 'red';
          this.context?.fillRect(x + this.PLAYER_PIECE.position.x, y + this.PLAYER_PIECE.position.y, 1, 1);
        }
      })
    });
  }

  movePiece( event:KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.PLAYER_PIECE.position.x--
    if (event.key === 'ArrowRight') this.PLAYER_PIECE.position.x++
    if (event.key === 'ArrowDown') this.PLAYER_PIECE.position.y++
  }




}

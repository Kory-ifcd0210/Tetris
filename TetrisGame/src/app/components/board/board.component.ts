import { Component, OnInit } from '@angular/core';
import { PIECES, PIECES_COLOR } from '../../const/pieces';


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

  score: number = 0;

  canvas!: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null | undefined;
  PLAYER_PIECE = {
    position: { x: 5, y: 5 },
    shape: PIECES[Math.floor(Math.random() * PIECES.length)]
  }

  dropCounter = 0;
  lastTime = 0;

  BOARD = this.createBoard(this.BOARD_WIDHT, this.BOARD_HEIGHT);

  createBoard(width: number, height: number) {
    const board = [];

    for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
            row.push(0);
        }
        board.push(row);
    }
    return board;
  }

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

  update(time = 0): void {
    const DELTA_TIME = time - this.lastTime;
    this.lastTime = time;

    this.dropCounter += DELTA_TIME;

    if (this.dropCounter > 500) {
      this.PLAYER_PIECE.position.y++;
      this.dropCounter = 0;
    }

    if (this.checkCollision()) {
      this.PLAYER_PIECE.position.y--;
      this.solidifyPiece();
      this.removeRows();
    }
    
    window.requestAnimationFrame((timestamp)=>{
      this.draw();
      this.update(timestamp);
    })
  }

  draw(): void {
    this.context!.fillStyle = '#000';
    this.context?.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
    
    this.BOARD.forEach((row, y) => {
      row.forEach((value: number, x: number) => {
        if (value === 1) {
          this.context!.fillStyle = '#6b0103';
          this.context?.fillRect(x, y, 1, 1);
        }
      })
    })

    this.PLAYER_PIECE.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1) {
          const COLOR_INDEX = PIECES.indexOf(this.PLAYER_PIECE.shape)
          this.context!.fillStyle = PIECES_COLOR[COLOR_INDEX];
          this.context?.fillRect(x + this.PLAYER_PIECE.position.x, y + this.PLAYER_PIECE.position.y, 1, 1);
        }
      })
    })
  }

  movePiece( event:KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.PLAYER_PIECE.position.x--;
      if (this.checkCollision()) {
        this.PLAYER_PIECE.position.x++;
      }
    }

    if (event.key === 'ArrowRight') {
      this.PLAYER_PIECE.position.x++;
      if (this.checkCollision()){
        this.PLAYER_PIECE.position.x--;
      }
    }

    if (event.key === 'ArrowDown') {
      this.PLAYER_PIECE.position.y++;
      if (this.checkCollision()){
        this.PLAYER_PIECE.position.y--;
        this.solidifyPiece();
        this.removeRows();
      }
    }

    if (event.key === 'ArrowUp') {
      const ROTATED = [];
      for (let i = 0; i < this.PLAYER_PIECE.shape[0].length; i++) {
        const ROW = [];
        for (let j = this.PLAYER_PIECE.shape.length - 1; j >= 0; j--) {
          ROW.push(this.PLAYER_PIECE.shape[j][i]);
        }
        ROTATED.push(ROW);
      }

      const PERVIOUS_SHAPE = this.PLAYER_PIECE.shape;
      this.PLAYER_PIECE.shape = ROTATED;
      if (this.checkCollision()) {
        this.PLAYER_PIECE.shape = PERVIOUS_SHAPE;
      }
    }
  }

  checkCollision (): number[] | undefined {
    return this.PLAYER_PIECE.shape.find((row, y) => {
      return row.find((value, x) => {
        return (
          value != 0 && 
          this.BOARD[y + this.PLAYER_PIECE.position.y]?.[x + this.PLAYER_PIECE.position.x] != 0
        )
      })
    })
  }

  solidifyPiece(): void {
    this.PLAYER_PIECE.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value === 1){
          this.BOARD[y + this.PLAYER_PIECE.position.y][x + this.PLAYER_PIECE.position.x] = 1;
        }
      })
    })
    
    const randomX = Math.floor(Math.random() * (this.BOARD_WIDHT - this.PLAYER_PIECE.shape[0].length - 2)) + 1;
    this.PLAYER_PIECE.position.x = randomX;
    this.PLAYER_PIECE.position.y = 0;

    this.PLAYER_PIECE.shape = PIECES[Math.floor(Math.random() * PIECES.length)];

    if (this.checkCollision()){
      window.alert('Game Over!!');
      this.BOARD.forEach((row) => row.fill(0));
    }
  }

  removeRows(): void {
    const rowsToRemove: number[] = [];
    this.BOARD.forEach((row, y) => {
      if (row.every((value: number) => value === 1)) {
        rowsToRemove.push(y);
      }
    })

    const rowsRemoved = rowsToRemove.length;
    if (rowsRemoved > 0) {
        const scoreIncrease = 10 * (2 ** (rowsRemoved - 1));
        this.score += scoreIncrease;

        rowsToRemove.forEach(y => {
            this.BOARD.splice(y, 1);
            const newRow = Array.from({ length: this.BOARD_WIDHT }, () => 0);
            this.BOARD.unshift(newRow);
        });
    }
  }

}

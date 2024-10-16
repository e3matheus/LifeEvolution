class GameOfLife:
    def __init__(self, board):
        self.board = board
        self.rows = len(board)
        self.cols = len(board[0])

    def count_neighbors(self, row, col):
        count = 0
        for i in range(max(0, row-1), min(self.rows, row+2)):
            for j in range(max(0, col-1), min(self.cols, col+2)):
                if i == row and j == col:
                    continue
                if self.board[i][j] == 1:
                    count += 1
        return count

    def next_generation(self):
        new_board = [[0 for _ in range(self.cols)] for _ in range(self.rows)]
        
        for i in range(self.rows):
            for j in range(self.cols):
                neighbors = self.count_neighbors(i, j)
                if self.board[i][j] == 1:
                    if neighbors in [2, 3]:
                        new_board[i][j] = 1
                else:
                    if neighbors == 3:
                        new_board[i][j] = 1
        
        return new_board

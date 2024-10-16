class GameOfLife3D:
    def __init__(self, board):
        self.board = board
        self.layers = len(board)
        self.rows = len(board[0])
        self.cols = len(board[0][0])

    def count_neighbors(self, layer, row, col):
        count = 0
        for l in range(max(0, layer-1), min(self.layers, layer+2)):
            for i in range(max(0, row-1), min(self.rows, row+2)):
                for j in range(max(0, col-1), min(self.cols, col+2)):
                    if l == layer and i == row and j == col:
                        continue
                    if self.board[l][i][j] == 1:
                        count += 1
        return count

    def next_generation(self):
        new_board = [[[0 for _ in range(self.cols)] for _ in range(self.rows)] for _ in range(self.layers)]
        
        for l in range(self.layers):
            for i in range(self.rows):
                for j in range(self.cols):
                    neighbors = self.count_neighbors(l, i, j)
                    if self.board[l][i][j] == 1:
                        if neighbors in [4, 5]:  # Adjusted rule for 3D
                            new_board[l][i][j] = 1
                    else:
                        if neighbors == 5:  # Adjusted rule for 3D
                            new_board[l][i][j] = 1
        
        return new_board

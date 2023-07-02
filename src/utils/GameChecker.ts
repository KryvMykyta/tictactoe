export class TicTacToeChecker {
    public static checkWinner(table: string[][]){
        for(let i = 0; i<3; i++){
            if(table[0][i] === table[1][i] && table[1][i] === table[2][i]) return table[0][i]
            if(table[i][0] === table[i][1] && table[i][1] === table[i][2]) return table[i][0]
        }
        if(table[0][0] === table[1][1] && table[1][1] === table[2][2]) return table[1][1]
        if(table[2][0] === table[1][1] && table[1][1] === table[0][2]) return table[1][1]

        return null
    }
}
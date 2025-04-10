import server from './server'
import colors from 'colors'

const port = process.env.PORT || 2000

server.listen(port, () => {
    console.log(colors.magenta.italic(`Servidor funcionando en http://localhost:${port}`))
})
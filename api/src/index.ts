import './LoadEnv' // Must be the first import

import app from '@server'
import DBConnector from '@db/index'
import logger from '@shared/Logger'

// connect to db
DBConnector.connectToDB()
  .then(() => {
    // start the server
    const port = Number(process.env.PORT || 3000)
    app.listen(port, () => {
      logger.info('Express server started on port: ' + port)
    })
  })

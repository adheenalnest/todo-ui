pipeline {
    agent any

    environment {
        CONTAINER_NAME = 'todo-ui'
        IMAGE_NAME = 'todo-frontend'
        NETWORK_NAME = 'todo-network'
        PORT_MAPPING = '4300:80'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build --no-cache -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    // Ensure Docker network exists
                    bat "docker network create ${NETWORK_NAME} 2>nul || ver >nul"

                    // Stop and remove existing container if running (current and old name)
                    bat "docker stop ${CONTAINER_NAME} 2>nul || ver >nul"
                    bat "docker rm ${CONTAINER_NAME} 2>nul || ver >nul"
                    bat "docker stop todo-angular-ui 2>nul || ver >nul"
                    bat "docker rm todo-angular-ui 2>nul || ver >nul"

                    // Stop any other container already occupying port 4300
                    powershell(returnStatus: true, script: 'docker ps -q --filter "publish=4300" | ForEach-Object { docker stop $_; docker rm $_ }')

                    // Launch new container using Windows Batch line continuation
                    bat """
                        docker run -d ^
                            --name ${CONTAINER_NAME} ^
                            --network ${NETWORK_NAME} ^
                            -p ${PORT_MAPPING} ^
                            ${IMAGE_NAME}:latest
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Frontend pipeline completed successfully!"
        }
        failure {
            echo "Frontend pipeline failed. Please check the logs."
        }
    }
}

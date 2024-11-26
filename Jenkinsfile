pipeline{
    agent any  

    stages{
        stage('Checkout'){
            steps{
                checkout scm
            }
        }
        stage('Sast Scan'){
            parallel{
                stage('frontend scan'){
                    steps{
                        dir('frontend'){
                            sh """                    
                            sonar-scanner
                            """
                        }
                    }
                }
                stage('Sast Scan backend'){
                    steps{
                        dir('backend'){
                            sh """                      
                            sonar-scanner
                            """
                        }                
                    }
                }        
            }
        }        
        stage('Deploy') {        
            steps {
                withCredentials([
                    file(credentialsId: 'backend-env', variable: 'ENV_FILE_BE'),
                    file(credentialsId: 'frontend-env', variable: 'ENV_FILE_FE')
                ]) {
                    script {
                        try{
                        sh """
                            cp ${ENV_FILE_BE}  backend/.env
                            cp ${ENV_FILE_FE} frontend/.env
                            docker compose up -d --build --force-recreate                            
                        """
                        }
                        catch(Exception e){
                            echo "Deployment failed ${e.message}"                            

                        }
                    }
                }
            }
        }
    }

    post{
        success{
            echo "Deployment completed successfully!"
        }
        failure{
            echo "Deployment failed. Check logs for details"
        }        
        always{
            cleanWs()
        }
    }
}
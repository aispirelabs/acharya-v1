# Deploying to AWS Amplify

This guide will help you deploy the application to AWS Amplify.

## Prerequisites

1. AWS Account
2. AWS CLI installed
3. Git repository for your code
4. Firebase project set up

## Environment Variables

Before deploying, ensure you have the following environment variables set in AWS Amplify:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Set up AWS Amplify**
   - Go to AWS Console
   - Navigate to AWS Amplify
   - Click "New app" > "Host web app"
   - Choose GitHub as your repository source
   - Select your repository and branch
   - Configure build settings

3. **Configure Build Settings**
   Use the following build settings in AWS Amplify:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

4. **Environment Variables**
   - In AWS Amplify Console, go to Environment Variables
   - Add all the Firebase environment variables
   - Save the changes

5. **Deploy**
   - AWS Amplify will automatically deploy your application
   - Monitor the build process in the Amplify Console
   - Once complete, you'll get a URL for your deployed application

## Custom Domain (Optional)

1. **Add Custom Domain**
   - In AWS Amplify Console, go to Domain Management
   - Click "Add domain"
   - Follow the instructions to add your custom domain
   - Update DNS settings as instructed

## Monitoring and Maintenance

1. **Monitor Performance**
   - Use AWS Amplify Console to monitor:
     - Build status
     - Deployment history
     - Performance metrics
     - Error logs

2. **Update Application**
   - Push changes to your repository
   - AWS Amplify will automatically rebuild and deploy

## Troubleshooting

1. **Build Failures**
   - Check build logs in AWS Amplify Console
   - Verify environment variables
   - Ensure all dependencies are in package.json

2. **Runtime Errors**
   - Check application logs
   - Verify Firebase configuration
   - Test locally before deploying

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to repository
   - Use AWS Amplify environment variables
   - Regularly rotate API keys

2. **Firebase Rules**
   - Review and update Firebase security rules
   - Implement proper authentication
   - Set up proper database rules

## Additional Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Firebase Security Rules](https://firebase.google.com/docs/rules) 
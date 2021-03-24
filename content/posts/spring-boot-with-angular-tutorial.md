---
title: "Spring Boot With Angular build integration"
date: 2020-05-11T15:09:22+02:00
draft: false
---

Angular and Spring Boot are pretty widely used technologies nowadays. Both projects are mature, well documented and supported by large community.
That is why  I decided to show you how to build self contained Angular 8 application backed with the Spring Boot 2 App.  
Code shown in this tutorial might be used as starter template for your own project.
All the code is available [on my github](https://github.com/tpalucki/angular-and-spring-boot-quickstart).

## Step 1 - Generate the Spring Boot App

Go to https://start.spring.io/ and pick:

1. Maven project  
2. Pick the Spring Boot version (I checked 2.2.7) 
3. Type in the project metadata for Maven build: group, artifact, name, description and package name  
4. Pick your Java version (I checked 14) with Jar packaging.  
5. No dependencies for now - you can add them if you need anything.

Your are now ready to generate your project package so push the **Generate** button.
Download and extract application to your workspace.

## Step 2 - Angular client

Now you are ready to scaffold the Angular Client. If you don't have the Angular CLI setup yet your can go through __Get started__ section of https://angular.io/docs  

go to your project directory and type:  

`$ ng new client`  

You will have to answer some question about your app configuration - Routing and Stylesheet format. Then press enter and within few seconds you have your client app generated.  
It is in client directory so we will have to move it to the root of your project to have nice sources structure under `/src/`

`$ cp -R client/* ./`

Then you can remove the `client` directory which is empty now.

`$ rm -rf ./client`

## Step 3 - Integrate Angular build with your Maven build

You should have your project imported to your favorite IDE by now.

Managing node and npm versions across multiple development environments is a pain in the ass of the every developer so ideally we would like to have the exact same configuration (versions of tools and dependencies) everywhere we build the application. This is exactly what __Frontent-Maven-Plugin__ provides! Plugin is available [here](https://github.com/eirslett/frontend-maven-plugin) together with some example configuration end docs.  

Below I have prepared the configuration for out project.
You can add it to your `pom.xml`:

```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
            <plugin>
                <groupId>com.github.eirslett</groupId>
                <artifactId>frontend-maven-plugin</artifactId>
                <version>1.9.1</version>
                <configuration>
                    <nodeVersion>v10.16.0</nodeVersion>
                </configuration>
                <executions>
                    <execution>
                        <id>install node and npm</id>
                        <goals>
                            <goal>install-node-and-npm</goal>
                        </goals>
                    </execution>

                    <execution>
                        <id>npm install</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>install</arguments>
                        </configuration>
                    </execution>

                    <execution>
                        <id>npm run build</id>
                        <goals>
                            <goal>npm</goal>
                        </goals>
                        <configuration>
                            <arguments>run build</arguments>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

```

This adds frontent-maven-plugin to our build. You can see we have the node version configured so you can insert your preferred one.  
In __executions__ section I have added steps for installing node, installing project dependencies and building the client app. It is now part of the Maven build.  
You can now install the node and all dependencies by running in the console:

`$ ./mvnw generate-resources`

It will download node with npm locally and build the application.

Don't forget to add `node` and `node_modules` directories to your `.gitignore` file - you don't want to push a ton of dependencies to the git repo!

`$ echo 'node' >> .gitignore`  
`$ echo 'node_modules' >> .gitignore`

## Step 4 - Running the build

You can test the build by running:  

`$ mvn clean package`

You don't have to generate all these on your own - I published a template project [on my github](https://github.com/tpalucki/angular-and-spring-boot-quickstart)

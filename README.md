# Technologies used
* React, chosen based on familiarity and because it happens to be part of your stack
* Redux, because it enforces good architecture and data management and it works well with React performancewise
* Redux-saga for dealing with side-effects and handling event streams, which is excellent for dealing with websockets
* SASS because I somewhat dislike JSS
* Reselect for optimizing redux selectors
* Dayjs as a lightweight alternative to Momentjs

# Instructions
1. Run "docker run -it --rm --name sbg-tech-test-api -p 8888-8890:8888-8890 sbgtechtest/api:2.0.0"
2. Run "yarn"
3. Run "yarn start"

# Improvements
* Add models for Event, Market and Outcome
* Add missing Betslip functionality
* Declare interfaces for component props and state


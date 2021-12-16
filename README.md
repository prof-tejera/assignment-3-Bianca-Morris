# Objective for Assignment 3

This is the 3rd and last assignment (A3) for E-39 Design Principles in React. Using our timers from Assignment 2 (A2), we will build a workout app that allows our users to assemble **multiple timers** into a workout queue. This workout queue will be executed in the order that the timers were added. Let's take a look at an example:

![Workout example 1](images/example_workout.png)

## Structural Changes to Context

We will have to make changes to our context in order to support the requirements for A3. In A2 we had to store the state of only one timer that we were configuring, now we will have to store all of the timers that the user has configured and the order that the timers will be executed when the user runs the workout. The order that the timers are created is the order in which they are executed.

The choice of data structure should be a queue, which follows First-In-First-Out, and supports the normal enqueue (add item to the queue) and dequeue (removes item from the queue). How you implement the queue is up to you, but things to consider are that:

1. Each timer can be in one of three states: running, completed, and not running. You will need a way to keep track of what state the timer is in, so that you can display it accordingly (see the image above) 
2. During configuration, the user can remove any timer from the queue, so you will be supporting deleting
3. While the timer is running, you will need to either store or dynamically calculate which timer is active. 
4. You don't want to clear the configurations as the timers are running. The user should be able to restart the entire workout at anytime

## Changes to Routing

Currently we have two routes `/` and `/docs`. We are going to be modifying our `/` screen and add a new one called `/add` using react-router.
### Home - Path should be `/`

- List of timers to be run for a workout. User should be able to remove a timer
- The total time the workout will take
- A button to "Add" a new timer. This button brings the user to the `/add` screen
- Controls to Pause/Resume the workout
- Controls to reset the workout back to its initial state
- Controls to "fast-forward" - ends the current running timer and moves onto the next one

### Add Timer - Path should be `/add`

- When user clicks "Add" from **Home** screen, they are routed to this page, where they can choose the type of timer and configure all inputs for each timer. After configuring, the user confirms and the timer is added to the list.
- The `/add` page should allow the user to configure any of the four timers (stopwatch, countdown, XY, and tabata)
- The user should be able to go back to the home page from here
## Installing and Running the project

As you have noticed this repository is empty. To begin this assignment you must copy over all of our files from A2 into this repo. **Do not copy over the `.git` directory and the `.gitignore` file.**. 

## Deliverable
- A user can configure (combination of any timers in any order) and execute a workout 
- All four timers must be functional: stopwatch, countdown, tabata, and XY.
- Routing must be configured to support the home route (`/`) and add route (`/add`)
- As you make modifications to your generic components, make sure to update documentation and prop-types. 


## Grading Rubric
- A workout can be configured with any combination of timers
- Final workout application should be bug free
- DRY (do not repeat yourself). Try to make sure common code is shared and not copy/pasted
- Console is free of warnings/errors
- Documentation and prop-types are defined and accurate
- Deploy your application

### Deployment Instructions (GH actions)

- Go to `Settings`
- Go to `Pages`
- in `Source`, select `gh-pages` branch
- Click Save
- In `package.json`, add a new key/value as: `"homepage": "https://prof-tejera.github.io/<repo>"`

Once the `build-deploy` action finishes running, the app should be live
at `https://prof-tejera.github.io/<repo>`

For other ways to deploy see https://github.com/prof-tejera/react-deployment-code

## Bonus

- Add full test coverage using Cypress.io. This will require that you get your tests running locally and then add a new Github action that will run the tests every time you commit to GitHub. Note that the Cypress setup is not part of this project and must be configured by you (max 8 points)


## References and Notes

[Link to Deployed project](https://prof-tejera.github.io/assignment-3-Bianca-Morris)

As before, I used a bunch of extra libraries and assets:

**Newly added:**
- [UsePersistedReducer NPM package](https://www.npmjs.com/package/use-persisted-reducer)
- [UUID NPM package](https://www.npmjs.com/package/uuid)
- [Cypress NPM package](https://www.npmjs.com/package/cypress)

**Newly referenced:**
- Cypress Docs
- https://infinitypaul.medium.com/reactjs-useeffect-usecallback-simplified-91e69fb0e7a3
- https://stackoverflow.com/questions/39549424/how-to-create-unique-keys-for-react-elements
- https://medium.com/trabe/react-usereducer-hook-2b1331bb768
- https://applitools.com/blog/testing-browser-alerts-confirmations-prompts-cypress/
- https://thewebdev.info/2021/03/14/how-to-set-state-with-a-deeply-nested-objects-with-react-hooks/

Alongside the ones from previous iterations...

**Art & Sound:**
- Background Image by Maarten van den Heuvel @ [unsplash](https://unsplash.com/@mvdheuvel)
- Alarm sounds from [mixkit](https://mixkit.co/free-sound-effects/alarm/)
- Iconography from [fontawesome](https://fontawesome.com/)

**Libraries & Re-used Code:**
- Use sound npm package/react hook by [Josh Comeau](https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/)
- UseInterval react hook by [Dan Abramov](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)
- UsePersistedState react hook by [Prof Tejera](https://github.com/prof-tejera/react7/blob/main/src/hooks.js)

**References, Research, & Inspiration:**
I got a bunch of ideas for how to construct a clean data model and solve various implementation problems from the following sources:
- https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
- https://stackoverflow.com/questions/13802587/how-can-i-convert-a-hhmmss-string-to-a-javascript-date-object
- https://stackoverflow.com/questions/51145692/styled-component-not-taking-props
- https://stackoverflow.com/questions/51770246/how-to-validate-numeric-inputs-in-reactjs
- https://stackoverflow.com/questions/55763957/how-to-clean-up-setinterval-in-useeffect-using-react-hooks/55764160
- https://stackoverflow.com/questions/53859601/how-do-i-clearinterval-on-click-with-react-hooks/55659592
- https://stackoverflow.com/questions/55020041/react-hooks-useeffect-cleanup-for-only-componentwillunmount
- https://medium.com/bb-tutorials-and-thoughts/how-to-create-a-countdown-timer-in-react-app-e99916046292
- https://javascript.plainenglish.io/this-is-how-i-created-a-countdown-timer-app-in-react-3644afbaabf6
- FontAwesome documentation
- React documentation
- MDN web documentation (Javascript)

Thanks to Brandon for helping with a stale state update bug.
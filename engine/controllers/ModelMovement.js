import { quat, vec3, mat4 } from 'glm';
import { Transform } from '../core/Transform.js';

export class ModelMovement {

    constructor(node, domElement, {
        pitch = 0,
        yaw = 0,
        velocity = [0, 0, 0],
        acceleration = 30,
        maxSpeed = 20,
        decay = 0.95,
        pointerSensitivity = 0,
        moveDelay = 0.2, // Delay in seconds between moves
        smoothness = 0.04, // Facotr for interpolation between 0 and 1
        isGrounded = true,
        gravity = -0.3,
        jumpForce = 12,
        groundLevel = 0 //initial Y position of the character
    } = {}) {
        this.node = node;
        this.domElement = domElement;

        this.keys = {};

        this.pitch = pitch;
        this.yaw = yaw;

        this.velocity = velocity;
        this.acceleration = acceleration;
        this.maxSpeed = maxSpeed;
        this.decay = decay;
        this.pointerSensitivity = pointerSensitivity;

        this.allowedPositions = [-2, -1, 0, 1, 2]; // Define five allowed x positions
        this.currentPositionIndex = 2; // Start at the middle position (index 2)

        this.moveDelay = moveDelay; // Time delay between moves
        this.lastMoveTime = 0; // Track time of last movement

        this.smoothness = smoothness;
        this.currentX = this.allowedPositions[this.currentPositionIndex]; // Current interpolated X position
        
        this.isGrounded = isGrounded;
        this.verticalSpeed = 0; // No initial vertical velocity
        this.gravity = gravity;
        this.jumpForce = jumpForce;
        this.groundLevel = groundLevel; // Y position where the character stands

        this.initHandlers();
    }

    initHandlers() {
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);
    }

    update(t, dt) {
        //Horizontal movements
        // Check if enough time has passed since the last move
        if (t - this.lastMoveTime >= this.moveDelay) {
            if (this.keys['KeyA'] && this.currentPositionIndex > 0) {
                this.currentPositionIndex -= 1; // Move left
                this.lastMoveTime = t; // Update last move time
            }
            if (this.keys['KeyD'] && this.currentPositionIndex < this.allowedPositions.length - 1) {
                this.currentPositionIndex += 1; // Move right
                this.lastMoveTime = t; // Update last move time
            }
        }
            //Vertical movement - jump
        if (this.keys['KeyW'] && this.isGrounded){
            this.verticalSpeed = this.jumpForce; // Apply upward force
            this.isGrounded = false;  //the character is now in the air
        }

        if (!this.isGrounded){
            this.verticalSpeed += this.gravity;
            const transform = this.node.getComponentOfType(Transform);

            if(transform){
                transform.translation[1] += this.verticalSpeed * dt; // Update Y position

                // Check if the character has landed
                if (transform.translation[1] <= this.groundLevel) {
                    transform.translation[1] = this.groundLevel; // Snap to ground
                    this.verticalSpeed = 0; // Reset vertical speed
                    this.isGrounded = true; // Allow another jump
                }
            }
        }
        // Smoothly interpolate the position
        const targetX = this.allowedPositions[this.currentPositionIndex]; // Get target position
        this.currentX += (targetX - this.currentX) * this.smoothness; // Smooth interpolation

        const transform = this.node.getComponentOfType(Transform);
        if (transform) {
            transform.translation[0] = this.currentX; // update X position smoothly
           // transform.translation[2] = -18; // Keep z constant to restrict movement to x-axis

            // Update rotation based on the Euler angles (keep rotation constant)
            const rotation = quat.create();
            quat.rotateY(rotation, rotation, this.yaw);
            quat.rotateX(rotation, rotation, this.pitch);
            transform.rotation = rotation;
        }
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }
}


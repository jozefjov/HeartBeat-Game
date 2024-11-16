export class NoteAnimator {
    constructor(noteModel, noteData) {
        this.noteModel = noteModel;
        this.noteData = noteData;
        this.active = true; // constrol wheter the animation is currently active
    }

    update(t, dt) {
        const { startTime, duaration, startPosition, endPosition, easingFunction } = this.noteData;

        // Calculate the normalized time for the animation (between 0 and 1)
        const elapsedTime = (t - startTime) / duaration;
        // TODO: Colission detection 
        if (elapsedTime < 0 || elapsedTime > 1) {
            this.active = false;
            return; // Animation not yet started or already completed
        }

        //Eased interpolation
        const easedProgress = easingFunction(elapsedTime);
        const transform = this.noteModel.getComponentOfType(Transform);
        vec3.lerp(transorm.translation, startPosition, endPosition, easedProgress);
    }
}
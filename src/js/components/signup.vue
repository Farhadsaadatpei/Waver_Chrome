<template>
    <div class="container py-3">
        <form>
        <div class="row">
            <div class="col-6">
                <div class="form-group">
                    <input type="text" class="form-control" id="firstName"  placeholder="First Name">
                </div>
            </div>
            <div class="col-6">

                <div class="form-group">
                    <input type="text" class="form-control" id="lasttName"  placeholder="Last Name">
                </div>
            </div>
        </div>
        <div class="form-group">
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div class="form-group">
            <input type="password" class="form-control" id="passwordSignUp" placeholder="Password">
        </div>
        <div class="form-group">
            <input type="password" class="form-control" id="confirmPasswordSignUp" placeholder="Confirm Password">
        </div>
        
        <button type="submit" class="btn btn-primary">Sign Up!</button>
        </form>
    </div>
</template>
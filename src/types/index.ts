export interface TaskType {
  id: string,
  name: string,
  completed: boolean,
  userId: string,
}

export interface TaskInputType {
  name: string,
  completed: boolean,
  userId: string,
}

export interface UserType {
  id: string,
  name: string,
  email: string,
}

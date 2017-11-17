import URL from './urls';

export function getLocations() {
    return webix.ajax().post(URL.get_locations);
}

export function addLocation(data) {
    return webix.ajax().post(URL.new_location, data);
}

export function editLocation(data) {
    return webix.ajax().post(URL.edit_location, data);
}

export function deleteLocation(data) {
    return webix.ajax().post(URL.delete_location, data);
}

export function getStaffModalFormContent() {
    return webix.ajax().post(URL.get_staff_modal_form);
}

export function getStaff(data) {
    return webix.ajax().post(URL.get_staff, data);
}

export function addNewEmployee(data) {
    return webix.ajax().post(URL.add_employee, data);
}

export function removeEmployee(data) {
    return webix.ajax().post(URL.remove_employee, data);
}
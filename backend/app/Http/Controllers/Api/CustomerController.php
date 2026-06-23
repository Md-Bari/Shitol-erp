<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Customer::query()->latest()->get()->map(fn (Customer $customer) => $this->payload($customer))]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:customers,email'],
            'phone' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'status' => ['required', 'in:lead,prospect,customer,inactive'],
            'value' => ['required', 'numeric', 'min:0'],
            'lastContact' => ['nullable', 'date'],
        ]);

        $data['last_contact'] = $data['lastContact'] ?? null;
        unset($data['lastContact']);

        $customer = Customer::query()->create($data);

        return response()->json(['data' => $this->payload($customer)], 201);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', 'unique:customers,email,'.$customer->id],
            'phone' => ['sometimes', 'required', 'string', 'max:255'],
            'company' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'required', 'in:lead,prospect,customer,inactive'],
            'value' => ['sometimes', 'required', 'numeric', 'min:0'],
            'lastContact' => ['nullable', 'date'],
        ]);

        if (array_key_exists('lastContact', $data)) {
            $data['last_contact'] = $data['lastContact'];
            unset($data['lastContact']);
        }

        $customer->update($data);

        return response()->json(['data' => $this->payload($customer->fresh())]);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $customer->delete();

        return response()->json(null, 204);
    }

    private function payload(Customer $customer): array
    {
        return [
            'id' => (string) $customer->id,
            'name' => $customer->name,
            'email' => $customer->email,
            'phone' => $customer->phone,
            'company' => $customer->company,
            'status' => $customer->status,
            'value' => (float) $customer->value,
            'lastContact' => $customer->last_contact?->format('Y-m-d'),
        ];
    }
}
